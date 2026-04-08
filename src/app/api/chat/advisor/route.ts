import { NextRequest, NextResponse } from "next/server";
import {
  generateAdvisorResponse,
  checkModelAvailability,
  AdvisorMessage,
} from "@/ai/college-advisor";

export const runtime = "nodejs";

export interface ChatRequest {
  message: string;
  history?: AdvisorMessage[];
}

/**
 * POST /api/chat/advisor
 * Handles chat requests to the College Advisor RAG model
 */
export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { message, history } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid request: message is required and must be a string" },
        { status: 400 }
      );
    }

    // Optional: Check model availability
    const isAvailable = await checkModelAvailability();
    if (!isAvailable) {
      return NextResponse.json(
        { error: "College Advisor model is currently unavailable" },
        { status: 503 }
      );
    }

    // Generate response
    const response = await generateAdvisorResponse(message, history || []);

    if (!response.success) {
      return NextResponse.json(
        { error: response.error || response.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: response.message,
      success: true,
      role: "assistant",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Chat API error:", errorMessage);
    return NextResponse.json(
      { error: "Failed to process chat request", details: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chat/advisor/health
 * Health check endpoint
 */
export async function GET() {
  try {
    const isAvailable = await checkModelAvailability();
    return NextResponse.json({
      status: isAvailable ? "healthy" : "unavailable",
      model: process.env.NEXT_PUBLIC_COLLEGE_ADVISOR_MODEL,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Health check failed" },
      { status: 500 }
    );
  }
}
