"""
FastAPI Backend for College Advisor RAG Model
Connects to Next.js Frontend for real-time chat
"""

import os
import logging
from typing import List, Optional
from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

# Load environment variables
load_dotenv(".env.local")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# ═══════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════

MODEL_NAME = os.getenv("MODEL_NAME", "Micheal324/CollegeAdvisor-RAG")
DEVICE = os.getenv("DEVICE", "auto")
MAX_LENGTH = int(os.getenv("MAX_LENGTH", "512"))
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8000"))
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

# Parse CORS origins
CORS_ORIGINS_STR = os.getenv("CORS_ORIGINS", '["http://localhost:3000"]')
try:
    import json
    CORS_ORIGINS = json.loads(CORS_ORIGINS_STR)
except:
    CORS_ORIGINS = ["http://localhost:3000", "http://localhost:3001"]

# ═══════════════════════════════════════════════════════════════════════════
# PYDANTIC MODELS
# ═══════════════════════════════════════════════════════════════════════════

class ChatMessage(BaseModel):
    """Chat message from frontend"""
    message: str
    conversation_id: Optional[str] = None
    max_length: Optional[int] = None

class ChatResponse(BaseModel):
    """Response sent to frontend"""
    reply: str
    success: bool
    error: Optional[str] = None
    timestamp: str
    model: str
    conversation_id: Optional[str] = None

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    model: str
    device: str
    torch_version: str

# ═══════════════════════════════════════════════════════════════════════════
# MODEL INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════════

logger.info(f"Loading model: {MODEL_NAME}")
logger.info(f"Device: {DEVICE}")

try:
    # Load tokenizer
    logger.info("Loading tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    
    # Load model
    logger.info("Loading model...")
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        device_map=DEVICE,
        torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
        trust_remote_code=True
    )
    
    # Create pipeline
    logger.info("Creating text generation pipeline...")
    rag_pipeline = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
        device=0 if torch.cuda.is_available() else -1
    )
    
    logger.info("✅ Model loaded successfully!")
    MODEL_LOADED = True
    
except Exception as e:
    logger.error(f"❌ Error loading model: {str(e)}")
    MODEL_LOADED = False
    rag_pipeline = None

# ═══════════════════════════════════════════════════════════════════════════
# FASTAPI APP
# ═══════════════════════════════════════════════════════════════════════════

app = FastAPI(
    title="College Advisor RAG API",
    description="Backend API for College Advisor Chatbot",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ═══════════════════════════════════════════════════════════════════════════
# ROUTES
# ═══════════════════════════════════════════════════════════════════════════

@app.get("/", tags=["Health"])
async def root():
    """Root endpoint"""
    return {
        "message": "College Advisor RAG API",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Check API and model status"""
    return HealthResponse(
        status="healthy" if MODEL_LOADED else "error",
        model=MODEL_NAME,
        device=str(torch.cuda.get_device() if torch.cuda.is_available() else "cpu"),
        torch_version=torch.__version__
    )

@app.post("/chat", response_model=ChatResponse, tags=["Chat"])
async def chat(request: ChatMessage):
    """
    Chat endpoint for College Advisor
    
    Args:
        request: ChatMessage with user message
        
    Returns:
        ChatResponse with AI reply
    """
    
    # Validate model is loaded
    if not MODEL_LOADED or rag_pipeline is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Please check server logs."
        )
    
    # Validate input
    if not request.message or not request.message.strip():
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty"
        )
    
    try:
        logger.info(f"Processing message: {request.message[:50]}...")
        
        # Generate response
        max_length = request.max_length or MAX_LENGTH
        
        response = rag_pipeline(
            request.message,
            max_length=max_length,
            num_return_sequences=1,
            temperature=0.7,
            top_p=0.95,
            do_sample=True,
            repetition_penalty=1.2
        )
        
        # Extract generated text
        generated_text = response[0]["generated_text"]
        
        # Clean up: remove input from output if present
        if request.message in generated_text:
            reply = generated_text.split(request.message)[-1].strip()
        else:
            reply = generated_text.strip()
        
        logger.info(f"✅ Generated response: {reply[:50]}...")
        
        return ChatResponse(
            reply=reply,
            success=True,
            timestamp=datetime.now().isoformat(),
            model=MODEL_NAME,
            conversation_id=request.conversation_id
        )
        
    except Exception as e:
        logger.error(f"❌ Error generating response: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating response: {str(e)}"
        )

@app.post("/batch-chat", tags=["Chat"])
async def batch_chat(requests: List[ChatMessage]):
    """
    Batch chat endpoint for multiple messages
    """
    results = []
    for req in requests:
        try:
            result = await chat(req)
            results.append(result)
        except HTTPException as e:
            results.append(ChatResponse(
                reply="",
                success=False,
                error=e.detail,
                timestamp=datetime.now().isoformat(),
                model=MODEL_NAME
            ))
    return results

# ═══════════════════════════════════════════════════════════════════════════
# STARTUP & SHUTDOWN
# ═══════════════════════════════════════════════════════════════════════════

@app.on_event("startup")
async def startup_event():
    """Run on server startup"""
    logger.info("🚀 College Advisor RAG API starting...")
    if not MODEL_LOADED:
        logger.warning("⚠️  Model failed to load. Check logs for details.")
    else:
        logger.info("✅ All systems ready!")

@app.on_event("shutdown")
async def shutdown_event():
    """Run on server shutdown"""
    logger.info("🛑 College Advisor RAG API shutting down...")

# ═══════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import uvicorn
    
    logger.info(f"Starting server at http://{API_HOST}:{API_PORT}")
    logger.info(f"API Docs: http://{API_HOST}:{API_PORT}/docs")
    
    uvicorn.run(
        "main:app",
        host=API_HOST,
        port=API_PORT,
        reload=DEBUG,
        log_level="info"
    )
