// Chatbot.js with dropdown-based multilingual speech input support
"use client";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useState, useRef, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from "firebase/firestore";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your HomeDoc AI assistant. I can help you with home remedies, analyze medical reports, and answer health-related questions. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en-IN");
  const [availableVoices, setAvailableVoices] = useState([]);
  const [showHistory, setShowHistory] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const utteranceRef = useRef(null);

  const supportedLanguages = [
    { label: "English (India)", code: "en-IN" },
    { label: "Hindi", code: "hi-IN" },
    { label: "Gujarati", code: "gu-IN" },
    { label: "Marathi", code: "mr-IN" },
    { label: "Tamil", code: "ta-IN" },
    { label: "Telugu", code: "te-IN" },
    { label: "Kannada", code: "kn-IN" },
    { label: "Malayalam", code: "ml-IN" },
    { label: "Punjabi", code: "pa-IN" },
    { label: "Bengali", code: "bn-IN" },
    { label: "Urdu", code: "ur-IN" }
  ];

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) setAvailableVoices(voices);
      else setTimeout(loadVoices, 200);
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  const speakText = (text) => {
    const speak = (lang, preferredNames) => {
      if (utteranceRef.current) window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;

      const voice =
        preferredNames
          .map(name =>
            availableVoices.find(
              v =>
                v.lang === lang &&
                v.name.toLowerCase().includes(name.toLowerCase())
            )
          )
          .find(Boolean) ||
        availableVoices.find(v => v.lang === lang && v.name.toLowerCase().includes("female")) ||
        availableVoices.find(v => v.lang === lang);

      if (voice) {
        utterance.voice = voice;
        console.log("✅ Selected voice:", voice.name, voice.lang);
      } else {
        console.warn("⚠️ No matching voice found for", lang);
      }

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    };

    const voiceMap = [
      { regex: /[ऀ-ॿ]/, lang: "hi-IN", names: ["Google हिन्दी"] },
      { regex: /[a-zA-Z]/, lang: "en-US", names: ["Google US English", "Google UK English Female", "zira", "emma"] },
      { regex: /\b(marathi|tamil|telugu|bengali|punjabi|kannada|gujarati|malayalam|assamese|manipuri|rajasthani|bhojpuri|bihari)\b/i, lang: "hi-IN", names: ["Google हिन्दी"] }
    ];

    let matched = false;
    for (const { regex, lang, names } of voiceMap) {
      if (regex.test(text)) {
        speak(lang, names);
        matched = true;
        break;
      }
    }

    if (!matched) {
      speak("en-US", ["Google US English", "Google UK English Female"]);
    }
  };

  const formatBotText = (text) => {
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^\s*\*\s+(.*)/gm, '<li>$1</li>');

    if (html.includes("<li>")) {
      html = `<ul>${html}</ul>`;
    }
    return html;
  };

  const getBotResponse = async (userInput) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: userInput })
      });
      const data = await res.json();
      return data.reply || "Sorry, I couldn't understand that.";
    } catch (err) {
      console.error("Fetch error:", err);
      return "Oops! Something went wrong.";
    }
  };

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      const userMessage = {
        id: messages.length + 1,
        text: inputText,
        sender: "user",
        timestamp: new Date(),
      };

      const botReplyText = await getBotResponse(inputText);

      setMessages((prev) => [
        ...prev,
        userMessage,
        {
          id: prev.length + 2,
          text: botReplyText,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);

      setInputText("");

      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, "chats"), {
          uid: user.uid,
          question: inputText,
          answer: botReplyText,
          timestamp: serverTimestamp(),
        });
      }
    }
  };

  const pauseSpeech = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  };

  const resumeSpeech = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  };

  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Speech recognition not supported.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = selectedLang;
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  return (
    <div className="chatbot-container">
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button onClick={() => setShowHistory(!showHistory)} className="sidebar-btn">
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </div>

      <div className="chat-header">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
        <h1>HomeDoc AI Chat</h1>
        <p>Your AI Health Assistant</p>
      </div>

      <div className="chat-messages">
        {showHistory && messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <div className="message-content">
              <div className="message-text">
                {msg.sender === "bot"
                  ? <div dangerouslySetInnerHTML={{ __html: formatBotText(msg.text) }} />
                  : msg.text}
                {msg.sender === "bot" && (
                  <span style={{ marginLeft: "10px" }}>
                    <button onClick={() => speakText(msg.text)}>🔊</button>
                    <button onClick={resumeSpeech} title="Resume speech">▶️</button>
                    <button onClick={pauseSpeech} title="Pause speech">⏸️</button>
                  </span>
                )}
              </div>
              <div className="message-time">
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <div className="input-wrapper">
          <div className="lang-dropdown-container">
            <label htmlFor="lang-select" className="lang-label">Select a language to speak in:</label>
            <select id="lang-select" className="lang-select small-dropdown" value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)}>
              {supportedLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask something..."
            className="chat-input"
            rows="1"
          />

          <button className={`mic-btn ${isListening ? "listening" : ""}`} onClick={startVoiceRecognition}>
            <i className="fas fa-microphone"></i>
          </button>

          <button className="send-btn" onClick={handleSendMessage} disabled={!inputText.trim()}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
