# College Advisor RAG Backend

FastAPI backend server for running the CollegeAdvisor-RAG model locally.

## 🚀 Quick Start

### 1. Setup Python Environment

```bash
# Create environment
conda create -n college-advisor python=3.10 -y
conda activate college-advisor

# Or with venv
python -m venv env
source env/bin/activate  # Linux/Mac
env\Scripts\activate      # Windows
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run Server

```bash
python main.py
```

Server will start at `http://localhost:8000`

## 📊 Endpoints

### Health Check
```bash
curl http://localhost:8000/health
```

### Chat
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is MIT?"}'
```

### API Docs
```
http://localhost:8000/docs
```

## ⚙️ Configuration

Edit `.env.local`:
- `MODEL_NAME` - Hugging Face model ID
- `DEVICE` - "auto", "cpu", or GPU ID
- `MAX_LENGTH` - Max response length
- `API_PORT` - Server port
- `CORS_ORIGINS` - Allowed frontend origins

## 🔧 Troubleshooting

**Model download fails:**
```bash
python -c "from transformers import AutoModelForCausalLM; AutoModelForCausalLM.from_pretrained('Micheal324/CollegeAdvisor-RAG')"
```

**CUDA not detected:**
```bash
python -c "import torch; print(torch.cuda.is_available())"
```

**Port already in use:**
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8001 python main.py
```

## 📚 Documentation

See `../LOCAL_RAG_SETUP.md` for complete setup guide.
