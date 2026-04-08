#!/usr/bin/env python
"""
Test script for College Advisor RAG Model
Run before starting the server to verify setup
"""

import sys
import torch
from pathlib import Path

def print_header(text):
    print(f"\n{'='*60}")
    print(f"  {text}")
    print(f"{'='*60}\n")

def test_pytorch():
    """Test PyTorch installation"""
    print_header("Testing PyTorch")
    print(f"✅ PyTorch Version: {torch.__version__}")
    print(f"✅ CUDA Available: {torch.cuda.is_available()}")
    if torch.cuda.is_available():
        print(f"✅ CUDA Device: {torch.cuda.get_device_name(0)}")
        print(f"✅ CUDA Version: {torch.version.cuda}")
    else:
        print("ℹ️  Running on CPU mode")
    return True

def test_transformers():
    """Test transformers library"""
    print_header("Testing Transformers")
    try:
        from transformers import __version__
        print(f"✅ Transformers Version: {__version__}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_model_download():
    """Test downloading the model"""
    print_header("Testing Model Download (This may take a few minutes...)")
    try:
        from transformers import AutoTokenizer, AutoModelForCausalLM
        
        model_name = "Micheal324/CollegeAdvisor-RAG"
        print(f"📥 Downloading: {model_name}")
        
        print("  - Loading tokenizer...")
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        
        print("  - Loading model...")
        model = AutoModelForCausalLM.from_pretrained(
            model_name,
            device_map="auto",
            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
        )
        
        print(f"✅ Model downloaded successfully!")
        return True
    except Exception as e:
        print(f"❌ Error downloading model: {e}")
        return False

def test_pipeline():
    """Test text generation pipeline"""
    print_header("Testing Text Generation Pipeline")
    try:
        from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
        
        model_name = "Micheal324/CollegeAdvisor-RAG"
        
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForCausalLM.from_pretrained(
            model_name,
            device_map="auto",
            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
        )
        
        print("  - Creating pipeline...")
        nlp = pipeline(
            "text-generation",
            model=model,
            tokenizer=tokenizer,
            device=0 if torch.cuda.is_available() else -1
        )
        
        print("  - Testing with sample prompt...")
        result = nlp(
            "What are the best universities for engineering?",
            max_length=100,
            num_return_sequences=1
        )
        
        print(f"✅ Pipeline test successful!")
        print(f"\n📝 Sample Output:\n{result[0]['generated_text'][:200]}...")
        return True
    except Exception as e:
        print(f"❌ Error testing pipeline: {e}")
        return False

def test_fastapi():
    """Test FastAPI installation"""
    print_header("Testing FastAPI")
    try:
        import fastapi
        import uvicorn
        print(f"✅ FastAPI Version: {fastapi.__version__}")
        print(f"✅ Uvicorn available")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Run all tests"""
    print("\n")
    print("╔" + "="*58 + "╗")
    print("║" + " "*58 + "║")
    print("║" + "  College Advisor RAG - Setup Verification".center(58) + "║")
    print("║" + " "*58 + "║")
    print("╚" + "="*58 + "╝")
    
    tests = [
        ("PyTorch", test_pytorch),
        ("Transformers", test_transformers),
        ("FastAPI", test_fastapi),
        ("Model Download", test_model_download),
        ("Text Generation Pipeline", test_pipeline),
    ]
    
    results = {}
    for name, test_func in tests:
        try:
            results[name] = test_func()
        except Exception as e:
            print(f"❌ Unexpected error in {name}: {e}")
            results[name] = False
    
    # Summary
    print_header("Summary")
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for name, result in results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{status}: {name}")
    
    print(f"\n📊 Result: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n✅ All tests passed! Your setup is ready.")
        print("Run: python main.py")
        return 0
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
