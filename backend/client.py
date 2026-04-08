"""
Client script to test College Advisor RAG API
"""

import requests
import json
from typing import Optional

class CollegeAdvisorClient:
    """Client for College Advisor RAG API"""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url.rstrip("/")
    
    def health_check(self) -> dict:
        """Check API health"""
        response = requests.get(f"{self.base_url}/health")
        response.raise_for_status()
        return response.json()
    
    def chat(self, message: str, max_length: int = 512, conversation_id: Optional[str] = None) -> dict:
        """Send message and get response"""
        payload = {
            "message": message,
            "max_length": max_length,
            "conversation_id": conversation_id
        }
        
        response = requests.post(
            f"{self.base_url}/chat",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        response.raise_for_status()
        return response.json()
    
    def batch_chat(self, messages: list) -> list:
        """Send multiple messages"""
        payload = [
            {"message": msg, "max_length": 512}
            for msg in messages
        ]
        
        response = requests.post(
            f"{self.base_url}/batch-chat",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        response.raise_for_status()
        return response.json()

def main():
    """Test the API"""
    print("\n" + "="*60)
    print("  College Advisor RAG API - Client Test")
    print("="*60 + "\n")
    
    client = CollegeAdvisorClient()
    
    # 1. Health check
    print("1️⃣  Health Check...")
    try:
        health = client.health_check()
        print(f"   ✅ Status: {health['status']}")
        print(f"   Model: {health['model']}")
        print(f"   Device: {health['device']}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return
    
    # 2. Single message
    print("\n2️⃣  Sending Test Message...")
    try:
        messages = [
            "What is MIT?",
            "Tell me about computer science programs",
            "Which universities are best for AI?"
        ]
        
        for msg in messages:
            print(f"\n   📤 Message: {msg}")
            response = client.chat(msg)
            print(f"   📥 Reply: {response['reply'][:150]}...")
            if not response['success']:
                print(f"   ⚠️  Error: {response.get('error', 'Unknown error')}")
    
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n" + "="*60)
    print("  ✅ Test Complete!")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
