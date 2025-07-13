# 🏥 HomeDoc AI

**HomeDoc AI** is a smart web-based health assistant that helps users understand symptoms, predict possible illnesses, analyze medical reports using OCR, and receive personalized health advice and home remedies — all through a user-friendly chatbot interface.

🌐 **Live Site:** [https://homedoc-ai-webapp.vercel.app](https://homedoc-ai-webapp.vercel.app)

---

## 🧩 Features

- 🤖 **AI Symptom-Based Disease Predictor**
- 🧾 **Medical Report Scanner** with OCR & Gemini-powered summaries
- 💬 **Conversational Chatbot** for symptom support & home remedies
- 🗣️ **Multilingual Support** 
- 🔐 **Secure Login** via Firebase Authentication
- 📩 **Contact Form** (via EmailJS)
- 📱 **Responsive & Mobile-Friendly UI** with Dark Mode

---

## 🛠️ Tech Stack

### 🎨 Frontend
- React.js  
- CSS & HTML  
- Firebase Authentication  
- Three.js *(for visual interactions)*  
- EmailJS *(contact form integration)*

### ⚙️ Backend
- FastAPI (Python)
- Scikit-learn (KNN, LabelEncoder, MultiLabelBinarizer)
- PyTesseract + Pillow + PyMuPDF (OCR & PDF parsing)
- Gemini Pro (Google's LLM for summarization & chatbot)

### 🚀 Deployment
- 🌐 Frontend: [Vercel](https://vercel.com)
- ☁️ Backend: [Render](https://render.com)

---

## 🗃️ Dataset Used

- [🧪 Kaggle – Disease and Symptoms Dataset](https://www.kaggle.com/datasets/dhivyeshrk/diseases-and-symptoms-dataset)

---

## 👥 Contributions

| Contributor        | Role & Responsibility                                                                 |
|--------------------|----------------------------------------------------------------------------------------|
| **Nidhi Devare**   | Frontend development (React, Three.js), Firebase Auth, chatbot UI, frontend-backend integration, deployment |
| **Aryan Wankhade** | Backend API (FastAPI), OCR handling, ML model training (KNN), Gemini API integration, dataset selection |

---

## 💼 Business Model & Market Scope

- 🏥 **B2B Model – Healthcare Providers:** Can be offered as a virtual triage assistant to hospitals, clinics, or diagnostic labs for faster patient pre-screening and automated symptom analysis.

- 👩‍⚕️ **B2B2C – Telemedicine Platforms:** Integrate with existing teleconsultation or digital health platforms to enhance patient intake, report interpretation, and chatbot-guided consultations.

- 📱 **B2C Model – Health & Wellness Apps:** Marketed directly to consumers for self-assessment, mental comfort, and preventive health advice — ideal for fitness, lifestyle, and chronic care apps.

- 🌐 **Rural & Multilingual Outreach:** Targets Tier 2 and Tier 3 cities in India through multilingual support, enabling scalable access to AI-powered healthcare assistance in underserved regions.

- 📈 **Freemium SaaS Model (Future Scope):** Core services can be free, with premium features (report history, doctor connect, voice bot, etc.) available via subscription or partner APIs.


---

## 🔮 Future Scope

- 📲 **Mobile App version** (React Native or Flutter)
- 📊 **Health tracking dashboard** with report history and trends
- 👨‍⚕️ **Doctor Connect**: Optional escalation to real doctors for second opinions
- 🔎 **Explainable AI**: Integrate LIME/SHAP for ML prediction reasoning

---

## 🛠️ How to Run the Project Locally

Follow the steps below to set up and run **HomeDoc AI** on your local machine.

---

### 🔹 Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [Python](https://www.python.org/) (3.8 or later)
- `pip` (Python package manager)
- `git`

---

### 📁 Clone the Repository

```bash
git clone https://github.com/yourusername/homedoc-ai-webapp.git
cd homedoc-ai
```
---

### 🎨 Frontend Setup

```bash
cd Frontend
npm install
npm start
```
---

### ⚙️ Backend Setup
```bash
cd Backend
pip install -r requirements.txt
uvicorn main:app --reload
```
---

### 🔐 Create `.env` File

Create a `.env` file inside the `Backend/` folder and add the following:

```env
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_API_KEY=your_firebase_web_api_key
