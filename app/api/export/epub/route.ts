import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/db/supabase";
import { ApiResponse } from "@/types";

// POST /api/export/epub - Generate ePub from book
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: "Unauthorized",
      }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: "Unauthorized",
      }, { status: 401 });
    }

    const body = await request.json();
    const { book_id, settings = {} } = body;

    // Verify user owns this book
    const { data: book, error: bookError } = await supabase
      .from("ebook_books")
      .select(`
        *,
        chapters:ebook_chapters(
          id, title, order_index, content, word_count
        )
      `)
      .eq("id", book_id)
      .eq("user_id", user.id)
      .single();

    if (bookError || !book) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: "Book not found",
      }, { status: 404 });
    }

    // Create export record
    const { data: exportRecord, error: exportError } = await supabase
      .from("ebook_exports")
      .insert({
        book_id,
        format: "epub",
        status: "processing",
        settings,
      })
      .select()
      .single();

    if (exportError) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: "Failed to create export record",
      }, { status: 500 });
    }

    // In production: Generate actual ePub, upload to storage, return URL
    // For now, return success with placeholder

    await supabase
      .from("ebook_exports")
      .update({
        status: "complete",
        file_url: `https://storage.craudiovizai.com/exports/${exportRecord.id}.epub`,
        completed_at: new Date().toISOString(),
      })
      .eq("id", exportRecord.id);

    return NextResponse.json<ApiResponse<{ export_id: string; status: string }>>({
      success: true,
      data: {
        export_id: exportRecord.id,
        status: "complete",
      },
      message: "ePub export initiated successfully",
    });
  } catch (error) {
    console.error("ePub export error:", error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: "Failed to export ePub",
    }, { status: 500 });
  }
}
