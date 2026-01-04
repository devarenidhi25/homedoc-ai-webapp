# 🏥 HomeDoc AI

**HomeDoc AI** is a smart web-based health assistant that helps users understand symptoms, predict possible illnesses, analyze medical reports using OCR, and receive personalized health advice and home remedies — all through a user-friendly chatbot interface.

🌐 **Live Site:** [https://homedoc-ai-webapp.vercel.app](https://homedoc-ai-webapp.vercel.app)

---

## 🧩 Features

- 🤖 **AI Symptom-Based Disease Predictor** using KNN machine learning model
- 🧾 **Medical Report Scanner** with OCR (PyTesseract) & Gemini-powered AI summaries
- 💬 **Conversational Chatbot** for symptom support, home remedies, and health advice
- 🗣️ **Multilingual Support** for diverse user base
- 🔐 **Secure Login** via Firebase Authentication
- 📩 **Contact Form** integration via EmailJS
- 📱 **Responsive & Mobile-Friendly UI** with Dark/Light Theme Toggle
- 🖼️ **X-Ray Image Classification** with CNN-based pneumonia detection
- 🎨 **Interactive 3D Animations** using Three.js
- 📄 **PDF Report Processing** with text extraction and summarization
- 🎤 **Voice Recording Support** with mic-recorder-to-mp3
- 📊 **Report Export** to PDF format with jsPDF
- 🔍 **Advanced Image Preprocessing** for medical image analysis

---

## 🛠️ Tech Stack

### 🧠 **Machine Learning & Deep Learning**
- **ML Models:**
  - Scikit-learn: KNN (k-Nearest Neighbors) for disease prediction
  - LabelEncoder & MultiLabelBinarizer for data preprocessing
  - Logistic Regression & SVM (Training framework)
  - Joblib for model serialization & loading
  
- **Deep Learning:**
  - TensorFlow/Keras for image classification
  - Pneumonia detection model (CNN-based .h5 format)
  - X-Ray image classification model

- **AI/LLM Services:**
  - Google Gemini Pro API for conversational AI & report summarization
  - Multi-turn conversational capabilities
  - Context-aware medical advice generation

### 💻 **Languages & Core Technologies**
- **Backend:** Python 3.8+
- **Frontend:** JavaScript (ES6+), React.js
- **OCR & Computer Vision:** PyTesseract, OpenCV, Pillow (PIL)
- **PDF Processing:** PyMuPDF (fitz), jsPDF
- **Image Processing:** Pillow (PIL), TensorFlow/Keras
- **Audio:** mic-recorder-to-mp3, Web Audio API

### 🎨 **Frontend Stack**
- **Framework:** React.js 18.2.0 (UI framework)
- **Styling:** CSS3 & HTML5
- **3D Graphics:** Three.js 0.158.0 (3D visual interactions & animations)
- **Authentication:** Firebase 11.9.1 (user authentication & management)
- **Email Service:** EmailJS 3.2.0 (contact form service)
- **HTTP Client:** Axios 1.10.0 (API requests)
- **Routing:** React Router DOM 6.8.0 (navigation)
- **UI Icons:** FontAwesome Free 6.7.2 (icon library)
- **Document Export:** jsPDF 3.0.1 (PDF generation)
- **Audio Recording:** mic-recorder-to-mp3 2.2.2 (voice recording)

### ⚙️ **Backend Stack**
- **Web Framework:** FastAPI (Python async framework)
- **Server:** Uvicorn (ASGI server)
- **Data Processing:** NumPy, Pandas
- **Machine Learning:** Scikit-learn, Joblib
- **OCR & Document:** PyTesseract, PyMuPDF (fitz)
- **Image Processing:** Pillow (PIL)
- **API Integration:** google-generativeai, Requests library
- **Config Management:** python-dotenv (environment variables)
- **File Handling:** python-multipart (file uploads)
- **CORS:** FastAPI CORS middleware

### 🚀 **Deployment & Infrastructure**
- **Frontend:** Vercel (serverless deployment)
- **Backend:** Render (cloud hosting)
- **Authentication:** Firebase (Google Cloud)
- **APIs:** Google Gemini Pro API, EmailJS API

---

## 🗃️ Dataset Used

[🧪 Kaggle – Disease and Symptoms Dataset](https://www.kaggle.com/datasets/dhivyeshrk/diseases-and-symptoms-dataset)

---

## 👥 Team & Technical Roles

| Name | Role | Technical Responsibilities |
|------|------|---------------------------|
| **Nidhi Devare** | Full-Stack Developer & Frontend Lead | React.js development, UI/UX implementation, Firebase authentication, Three.js integration, voice recording (mic-recorder-to-mp3), PDF export (jsPDF), frontend-backend API integration, responsive design, dark mode toggle, deployment on Vercel |
| **Aryan Wankhade** | Backend Lead & ML Engineer | FastAPI backend development, KNN ML model training & optimization, OCR implementation (PyTesseract), PDF text extraction (PyMuPDF), Gemini Pro API integration, image preprocessing & CNN model training for X-Ray classification, dataset selection & processing, model serialization (Joblib), backend deployment on Render |

### 🔧 Technical Expertise Areas
- **Machine Learning:** Supervised learning (KNN, SVM, Logistic Regression), feature engineering, data preprocessing, model training & evaluation, hyperparameter tuning
- **Deep Learning:** CNN-based image classification, transfer learning, model serialization (.h5 format), medical image analysis
- **Backend Development:** RESTful API design, async/await patterns with FastAPI, middleware integration, CORS configuration, file upload handling
- **Frontend Development:** Component-based React architecture, state management with Context API & hooks, responsive CSS, interactive animations with Three.js
- **Computer Vision:** Image processing (Pillow/OpenCV), medical image analysis, OCR with PyTesseract, PDF extraction with PyMuPDF
- **Natural Language Processing:** LLM integration (Gemini Pro), conversational AI design, text summarization, multi-turn dialogues
- **Cloud & DevOps:** Deployment automation (Vercel, Render), environment variable management, API integration, serverless architecture
- **Full-Stack Integration:** Frontend-backend communication, real-time data processing, file handling (images, PDFs)

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
cd homedoc-ai-webapp
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
