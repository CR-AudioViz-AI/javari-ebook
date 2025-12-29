import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/db/supabase";
import { ApiResponse } from "@/types";

interface GenerateRequest {
  book_id: string;
  chapter_id: string;
  chapter_title: string;
  chapter_summary: string;
  target_word_count: number;
  voice_profile?: {
    tone: string;
    style: string[];
    vocabulary_level: string;
  };
  previous_chapter_summary?: string;
  sections?: {
    title: string;
    summary: string;
    target_word_count: number;
  }[];
}

// POST /api/ai/generate - Generate chapter content
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

    const body: GenerateRequest = await request.json();
    const {
      book_id,
      chapter_id,
      chapter_title,
      chapter_summary,
      target_word_count,
      voice_profile,
      previous_chapter_summary,
      sections,
    } = body;

    // Verify user owns this book
    const { data: book, error: bookError } = await supabase
      .from("ebook_books")
      .select("id, title, book_type, target_audience, voice_profile")
      .eq("id", book_id)
      .eq("user_id", user.id)
      .single();

    if (bookError || !book) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: "Book not found",
      }, { status: 404 });
    }

    const toneDescription = voice_profile?.tone || book.voice_profile?.tone || "professional yet approachable";
    const vocabLevel = voice_profile?.vocabulary_level || book.voice_profile?.vocabulary_level || "moderate";

    // Build section outline if provided
    const sectionOutline = sections
      ? sections.map((s, i) => `\n${i + 1}. ${s.title}: ${s.summary} (~${s.target_word_count} words)`).join("")
      : "";

    const systemPrompt = `You are an expert author writing a chapter for "${book.title}".
This is a ${book.book_type} book targeting: ${book.target_audience || "general readers"}.

Writing style requirements:
- Tone: ${toneDescription}
- Vocabulary level: ${vocabLevel}
- Write engaging, professional content
- Use clear paragraph breaks
- Include relevant examples and explanations
- Maintain consistent voice throughout

Target word count: approximately ${target_word_count} words.
${sectionOutline ? `\nFollow this section structure:${sectionOutline}` : ""}

Write the complete chapter content. Use markdown formatting for headings (##, ###), emphasis (*italic*, **bold**), and lists where appropriate.
Do NOT include the chapter title as a heading - it will be added separately.
${previous_chapter_summary ? `\nPrevious chapter context: ${previous_chapter_summary}` : ""}

The Henderson Standard applies: Fortune 50 quality, zero shortcuts.`;

    // Call Anthropic API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8192,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Write Chapter: "${chapter_title}"\n\nChapter summary: ${chapter_summary}\n\nWrite the complete chapter now.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", errorText);
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: "AI service unavailable",
      }, { status: 503 });
    }

    const aiResponse = await response.json();
    const content = aiResponse.content?.[0]?.text || "";
    
    // Calculate word count
    const wordCount = content.split(/\s+/).filter(Boolean).length;

    // Update chapter in database
    const { error: updateError } = await supabase
      .from("ebook_chapters")
      .update({
        content,
        word_count: wordCount,
        status: "draft",
      })
      .eq("id", chapter_id);

    if (updateError) {
      console.error("Error updating chapter:", updateError);
    }

    // Log AI usage
    await supabase.from("ebook_ai_logs").insert({
      book_id,
      chapter_id,
      action_type: "chapter_generation",
      prompt: chapter_summary.substring(0, 1000),
      response: content.substring(0, 5000),
      model: "claude-sonnet-4-20250514",
      tokens_used: aiResponse.usage?.input_tokens + aiResponse.usage?.output_tokens,
      credits_charged: Math.ceil(target_word_count / 1000) * 20,
    });

    return NextResponse.json<ApiResponse<{ content: string; word_count: number }>>({
      success: true,
      data: {
        content,
        word_count: wordCount,
      },
      message: "Chapter generated successfully",
    });
  } catch (error) {
    console.error("Chapter generation error:", error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: "Failed to generate chapter",
    }, { status: 500 });
  }
}
