# EduCompass – Intelligent University Search & Recommendation System

## Overview
EduCompass is an intelligent web platform that assists students in discovering universities tailored to their academic background, financial circumstances, and eligibility. It streamlines decision-making for students at key educational milestones, including post-10th, post-12th, undergraduate to postgraduate transitions, and international studies.

---

## Key Features

- **Advanced Search & Filtering**
  - Filter universities by CGPA/percentage, entrance exam scores (GRE, GMAT, TOEFL, etc.), budget, and location (India or abroad).
  - Real-time, multi-parameter search, designed for scalability.

- **Comprehensive University Database**
  - Structured datasets for reliable comparison.
  - User-friendly interface for streamlined exploration.

- **Personalized Recommendations**
  - Hybrid filtering and scoring models.
  - Suggestions based on academic profile, budget, and career objectives.

---

## System Architecture

- **Frontend:** UI Layer (HTML, CSS, JavaScript)
- **Search & Filtering Engine**
- **Data:** University Dataset (JSON/MySQL)
- **Recommendation Logic:** Scoring and ranking algorithms

---

## Technology Stack

| Layer      | Technology               |
|------------|--------------------------|
| Frontend   | HTML, CSS, JavaScript    |
| Backend    | Django / Python (Planned)|
| Database   | JSON / MySQL             |
| Hosting    | Firebase / Web           |

---

## Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/vrushabh-007/Educompass.git
   cd Educompass
   ```

2. **Launch the Application:**
   - Open `index.html` in your browser, or
   - Use VS Code's Live Server extension for a local development environment.

---

## Research & Technical Novelty

- Hybrid multi-parameter filtering and ranking.
- Weighted composite scoring for recommendations:
  ```
  SCORE = w1 * (CGPA Match) + w2 * (Budget Fit) + w3 * (Location Preference) + w4 * (Exam Score Match)
  ```
- Scalable search architecture (capable of Trie-based filtering, inverted indexing, etc.)

---

## Roadmap

- AI/ML-based recommendation engine
- User authentication and profile management
- Analytics dashboards
- Report export (PDF)
- Integrated AI chatbot guidance
- Real-time university data APIs
- Comprehensive testing strategy
