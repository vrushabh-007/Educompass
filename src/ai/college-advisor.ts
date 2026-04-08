/**
 * College Advisor RAG Model Integration
 * Loads the Micheal324/CollegeAdvisor-RAG model for conversational AI counselor
 */

import { HfInference } from "@huggingface/inference";

const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;
const MODEL_NAME = process.env.NEXT_PUBLIC_COLLEGE_ADVISOR_MODEL || "Micheal324/CollegeAdvisor-RAG";
const HF_INFERENCE_API = "https://api-inference.huggingface.co/models";

if (!HF_TOKEN) {
  console.warn("Warning: HUGGINGFACE_TOKEN not set in environment variables");
}

/**
 * Initialize Hugging Face Inference client
 */
const hf = new HfInference(HF_TOKEN);

export interface AdvisorMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AdvisorResponse {
  message: string;
  success: boolean;
  error?: string;
}

/**
 * Generate a response from the College Advisor RAG model
 * @param userMessage - The user's input message
 * @param conversationHistory - Previous messages in the conversation (optional)
 * @returns Promise with the advisor's response
 */
export async function generateAdvisorResponse(
  userMessage: string,
  conversationHistory: AdvisorMessage[] = []
): Promise<AdvisorResponse> {
  try {
    if (!HF_TOKEN) {
      throw new Error("HUGGINGFACE_TOKEN is not configured");
    }

    if (!userMessage.trim()) {
      return {
        message: "Please provide a message.",
        success: false,
        error: "Empty message",
      };
    }

    // Format conversation history for the model
    let formattedInput = "";
    
    // Add conversation context if available
    if (conversationHistory.length > 0) {
      conversationHistory.forEach((msg) => {
        formattedInput += `${msg.role === "user" ? "User" : "Advisor"}: ${msg.content}\n`;
      });
    }
    
    formattedInput += `User: ${userMessage}\nAdvisor:`;

    // Try direct API call first (more reliable)
    try {
      const response = await fetch(`${HF_INFERENCE_API}/${MODEL_NAME}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: formattedInput,
          parameters: {
            max_new_tokens: 512,
            do_sample: true,
            temperature: 0.7,
            top_p: 0.95,
            repetition_penalty: 1.2,
          },
          details: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn("API response not ok, trying HfInference client:", response.status, errorData);
        
        // Fallback to HfInference client
        return await generateAdvisorResponseWithClient(formattedInput);
      }

      const result = await response.json();
      
      // Handle array response from API
      let generatedText = "";
      if (Array.isArray(result)) {
        generatedText = result[0]?.generated_text || "";
      } else {
        generatedText = result.generated_text || "";
      }

      // Extract only the new generated part (after the input)
      const advisorResponse = generatedText
        .substring(formattedInput.length)
        .trim()
        .split("\n")[0]; // Take first line to avoid breaking format

      return {
        message: advisorResponse || "I apologize, but I couldn't generate a response. Please try again.",
        success: true,
      };
    } catch (apiError) {
      console.warn("Direct API call failed, using HfInference client:", apiError);
      // Fallback to HfInference client
      return await generateAdvisorResponseWithClient(formattedInput);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error generating advisor response:", errorMessage);
    return {
      message: "I encountered an error while processing your request. Please try again.",
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Fallback function using HfInference client
 */
async function generateAdvisorResponseWithClient(
  formattedInput: string
): Promise<AdvisorResponse> {
  try {
    const response = await hf.textGeneration({
      model: MODEL_NAME,
      inputs: formattedInput,
      parameters: {
        max_new_tokens: 512,
        do_sample: true,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.2,
      },
    });

    const generatedText = response.generated_text;
    const advisorResponse = generatedText
      .substring(formattedInput.length)
      .trim()
      .split("\n")[0];

    return {
      message: advisorResponse || "I apologize, but I couldn't generate a response. Please try again.",
      success: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error with HfInference client:", errorMessage);
    throw error;
  }
}

/**
 * Check if the model is accessible
 */
export async function checkModelAvailability(): Promise<boolean> {
  try {
    if (!HF_TOKEN) {
      console.warn("HF token not available");
      return false;
    }
    // Try to get model info
    const response = await fetch(
      `https://huggingface.co/api/models/${MODEL_NAME}`,
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
        },
      }
    );
    return response.ok;
  } catch (error) {
    console.error("Model availability check failed:", error);
    return false;
  }
}
