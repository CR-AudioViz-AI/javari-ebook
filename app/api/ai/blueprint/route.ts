import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/db/supabase";
import { ApiResponse, BookBlueprint, InterviewResponse } from "@/types";

// POST /api/ai/blueprint - Generate book blueprint from interview responses
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
    const { interview_responses } = body as { interview_responses: InterviewResponse[] };

    if (!interview_responses || interview_responses.length === 0) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: "Interview responses are required",
      }, { status: 400 });
    }

    // Format interview responses for the AI
    const formattedResponses = interview_responses
      .map((r) => `**${r.question}**\n${r.answer}`)
      .join("\n\n");

    const systemPrompt = `You are an expert book strategist and publishing consultant for CRAV eBook Studio. 
Your job is to analyze interview responses from an aspiring author and create a comprehensive book blueprint.

You must respond with valid JSON only, no markdown or explanations. The JSON must match this exact structure:
{
  "title": "Compelling book title",
  "subtitle_options": ["Option 1", "Option 2", "Option 3"],
  "description": "2-3 paragraph book description for marketing",
  "target_audience": "Detailed description of ideal reader",
  "book_type": "fiction|nonfiction|guide|memoir|academic|children|other",
  "target_word_count": 50000,
  "tone": "Description of voice and tone",
  "chapters": [
    {
      "title": "Chapter Title",
      "summary": "2-3 sentence summary of chapter content",
      "target_word_count": 5000,
      "sections": [
        {
          "title": "Section Title",
          "summary": "Brief section description",
          "target_word_count": 1500
        }
      ]
    }
  ],
  "research_needs": ["Topic 1 requiring research", "Topic 2"],
  "media_requirements": ["Type of images needed", "Charts/diagrams needed"],
  "estimated_credits": 500
}

Create a professional, well-structured blueprint that will result in a high-quality, publishable book.
Include 8-15 chapters depending on the target length. Each chapter should have 2-4 sections.
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
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Based on these interview responses, create a comprehensive book blueprint:\n\n${formattedResponses}`,
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
    const responseText = aiResponse.content?.[0]?.text || "";

    // Parse the JSON response
    let blueprint: BookBlueprint;
    try {
      const cleanJson = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      blueprint = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("Failed to parse AI response:", responseText);
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: "Failed to generate blueprint. Please try again.",
      }, { status: 500 });
    }

    return NextResponse.json<ApiResponse<BookBlueprint>>({
      success: true,
      data: blueprint,
      message: "Blueprint generated successfully",
    });
  } catch (error) {
    console.error("Blueprint generation error:", error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: "Failed to generate blueprint",
    }, { status: 500 });
  }
}
