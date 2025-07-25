"use client"
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useState, useRef, useEffect } from "react"
import { db, auth } from "../firebase"
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from "firebase/firestore"
import "./Chatbot.css"

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your HomeDoc AI assistant. I can help you with home remedies, analyze medical reports, and answer health-related questions. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [showHistory, setShowHistory] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const utteranceRef = useRef(null)
  const [availableVoices, setAvailableVoices] = useState([]);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    loadVoices();
  }, []);
  
  const speakText = (text) => {
    const speak = (lang, preferredNames) => {
      if (utteranceRef.current) window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      const selectedVoice = availableVoices.find(v =>
        v.lang === lang && preferredNames.some(name => v.name.toLowerCase().includes(name.toLowerCase()))
      ) || availableVoices.find(v => v.lang === lang && v.name.toLowerCase().includes("female")) || availableVoices.find(v => v.lang === lang);
      if (selectedVoice) utterance.voice = selectedVoice;
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    };

    const voiceMap = [
      { regex: /[a-zA-Z]/, lang: "en-IN", names: ["Google UK English Female", "Google US English", "female"] },
      { regex: /[ऀ-ॿ]/, lang: "hi-IN", names: ["Google हिन्दी", "Microsoft Kalpana", "female"] },
      { regex: /[ऀ-ॿ]/, lang: "mr-IN", names: ["Google मराठी", "female"] },
      { regex: /[਀-੿]/, lang: "pa-IN", names: ["Google ਪੰਜਾਬੀ", "female"] },
      { regex: /[ঀ-৿]/, lang: "bn-IN", names: ["Google বাংলা", "female"] },
      { regex: /[஀-௿]/, lang: "ta-IN", names: ["Google தமிழ்", "female"] },
      { regex: /[ఀ-౿]/, lang: "te-IN", names: ["Google తెలుగు", "female"] },
      { regex: /[ഀ-ൿ]/, lang: "ml-IN", names: ["Google മലയാളം", "female"] },
      { regex: /[ಀ-೿]/, lang: "kn-IN", names: ["Google ಕನ್ನಡ", "female"] },
      { regex: /[઀-૿]/, lang: "gu-IN", names: ["Google ગુજરાતી", "female"] },
      { regex: /[ঀ-৿]/, lang: "as-IN", names: ["Google অসমীয়া", "female"] },
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
      const femaleEnglishVoices = availableVoices.filter(
        v =>
          v.lang.startsWith("en") &&
          (v.name.toLowerCase().includes("female") ||
          v.name.toLowerCase().includes("zira") ||   // Microsoft female
          v.name.toLowerCase().includes("aria") ||   // Microsoft AI female
          v.name.toLowerCase().includes("susan") ||  // Possible names
          v.name.toLowerCase().includes("emma") ||   // UK English female
          v.name.toLowerCase().includes("google uk english female") ||
          v.name.toLowerCase().includes("google us english")
          )
      );

      const fallbackVoiceNames = femaleEnglishVoices.map(v => v.name);
      speak("en-IN", fallbackVoiceNames.length ? fallbackVoiceNames : ["female"]);
    }

  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const loadChatHistory = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "chats"),
        where("uid", "==", user.uid),
        orderBy("timestamp", "asc")
      );
      const snapshot = await getDocs(q);
      const history = snapshot.docs.map((doc, index) => {
        const data = doc.data();
        return [
          {
            id: index * 2 + 1,
            text: data.question,
            sender: "user",
            timestamp: data.timestamp?.toDate() || new Date()
          },
          {
            id: index * 2 + 2,
            text: data.answer,
            sender: "bot",
            timestamp: data.timestamp?.toDate() || new Date()
          }
        ];
      }).flat();

      setMessages(history);
    };

    loadChatHistory();
  }, []);

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
        {
          id: prev.length + 1,
          text: inputText,
          sender: "user",
          timestamp: new Date(),
        },
        {
          id: prev.length + 2,
          text: botReplyText,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);

      setInputText(""); // ✅ Clear input after messages are updated


      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, "chats"), {
          uid: user.uid,
          question: inputText,
          answer: botReplyText,
          timestamp: serverTimestamp(),
        });
      }

      setInputText("");
    }
  };

  const getBotResponse = async (userInput) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: userInput }),
      });
      const data = await response.json();
      return data.reply || "Sorry, I couldn't understand that.";
    } catch (error) {
      console.error("Error fetching bot response:", error);
      return "Oops! Something went wrong. Please try again.";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const fileMessage = {
        id: messages.length + 1,
        text: `📄 Uploaded file: ${file.name}`,
        sender: "user",
        timestamp: new Date(),
        isFile: true,
      }
      setMessages((prev) => [...prev, fileMessage])

      setTimeout(() => {
        const analysisResponse = {
          id: messages.length + 2,
          text: "I've received your file. Based on the document type, I can provide general insights. For blood reports, I can explain normal ranges and highlight any values that might need attention. For imaging reports, I can help explain medical terminology. Please note that this is for informational purposes only - always consult your healthcare provider for professional medical advice.",
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, analysisResponse])
      }, 1500)
    }
  }

  const startVoiceRecognition = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "en-US"

      setIsListening(true)

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputText(transcript)
        setIsListening(false)
      }

      recognition.onerror = () => setIsListening(false)
      recognition.onend = () => setIsListening(false)
      recognition.start()
    } else {
      alert("Speech recognition is not supported in your browser.")
    }
  }


  const pauseSpeech = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause()
    }
  }

  const resumeSpeech = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
    }
  }

  return (
    <div className="chatbot-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button onClick={() => setShowHistory(prev => !prev)} className="sidebar-btn">
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </div>

      <div className="chat-header">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(prev => !prev)}>
          ☰
        </button>
        <h1>HomeDoc AI Chat</h1>
        <p>Your AI Health Assistant</p>
      </div>

      <div className="chat-messages">
        {showHistory && messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-content">
              <div className="message-text">
                {message.isFile ? (
                  <span className="file-indicator">{message.text}</span>
                ) : (
                  <>
                    {message.sender === "bot" ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: message.text
                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                            .replace(/\n/g, "<br/>")
                        }}
                      />
                    ) : (
                      message.text
                    )}
                    {message.sender === "bot" && (
                      <span style={{ marginLeft: "10px" }}>
                        <button onClick={() => speakText(message.text)} title="Read aloud">🔊</button>
                        <button onClick={resumeSpeech} title="Resume speech">▶️</button>
                        <button onClick={pauseSpeech} title="Pause speech">⏸️</button>
                      </span>
                    )}
                  </>
                )}
              </div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <div className="input-wrapper">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            style={{ display: "none" }}
          />
          <button className="file-upload-btn" title="Upload file" onClick={() => fileInputRef.current.click()}>
            <i className="fas fa-paperclip"></i>
          </button>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your health question or describe your symptoms..."
            className="chat-input"
            rows="1"
          />

          <button
            className={`mic-btn ${isListening ? "listening" : ""}`}
            onClick={startVoiceRecognition}
            title="Voice input"
          >
            <i className="fas fa-microphone"></i>
          </button>

          <button className="send-btn" onClick={handleSendMessage} disabled={!inputText.trim()}>
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chatbot