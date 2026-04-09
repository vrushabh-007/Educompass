# 📚 EduCompass – Intelligent University Search & Recommendation System

## 🚀 Overview
EduCompass is a smart web-based platform designed to help students discover universities based on personalized academic, financial, and eligibility criteria.

It simplifies the decision-making process for:
- 🎓 After 10th
- 🎓 After 12th
- 🎓 Undergraduate → Postgraduate
- 🌍 Studying Abroad

---

## 🎯 Key Features

### 🔍 Advanced Search & Filtering
- Filter by:
  - CGPA / Percentage
  - Entrance Exams (GRE, GMAT, TOEFL, etc.)
  - Budget constraints
  - Preferred location (India / Abroad)
- Real-time filtering
- Scalable for large datasets

### 🏫 University Discovery
- Structured university dataset
- Easy comparison between universities
- Clean and intuitive UI

### 📊 Recommendation System
- Rule-based + scoring model
- Personalized suggestions based on:
  - Academic profile
  - Budget
  - Career goals

---

## 🧠 System Architecture
Frontend (UI Layer)
↓
Search & Filtering Engine
↓
University Dataset (JSON / Database)
↓
Recommendation Logic (Scoring + Ranking)


---

## ⚙️ Tech Stack

| Layer        | Technology |
|-------------|-----------|
| Frontend     | HTML, CSS, JavaScript |
| Backend (Future Scope) | Django / Python |
| Database     | JSON / MySQL |
| Hosting      | Firebase / Web |

---

## 🛠️ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/vrushabh-007/Educompass.git
cd Educompass
#Run Project
Open index.html in your browser
OR
Use Live Server (VS Code)

###🔬 Novelty (For Research Paper)

EduCompass uses a hybrid filtering + ranking system:

Multi-parameter filtering
Weighted scoring model
Efficient search (can extend to:
Trie-based filtering
Inverted Indexing
)
###📌 Scoring Formula

#Score = w1(CGPA Match) + w2(Budget Fit) + w3(Location Preference) + w4(Exam Score Match)

###📈 Future Enhancements

🤖 AI/ML-based recommendations
🔐 User login & profile system
📊 Analytics dashboard
📄 Export reports (PDF)
💬 AI chatbot for guidance
🌐 Real-time university APIs
🧪 Testing Strategy

