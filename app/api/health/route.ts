import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "crav-ebook-studio",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    features: {
      ai_interview: true,
      rich_editor: true,
      citations: true,
      media_integration: true,
      multi_format_export: true,
    },
  });
}
