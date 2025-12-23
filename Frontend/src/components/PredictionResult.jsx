import React from "react"
import "./PredictionResult.css"

const PredictionResult = ({ prediction, imagePreview }) => {
  const {
    predicted_class,
    confidence,
    confidence_score,
    class_probabilities,
    heatmap_image,
    message,
  } = prediction

  // Convert confidence to percentage if it's between 0 and 1
  const confidencePercent =
    confidence_score > 1 ? confidence_score : Math.round(confidence_score * 100)

  // Get confidence status based on percentage
  const getConfidenceStatus = (percent) => {
    if (percent >= 80) return "High Confidence"
    if (percent >= 60) return "Moderate Confidence"
    return "Low Confidence"
  }

  return (
    <div className="prediction-result">
      <div className="result-grid">
        {/* Original Image */}
        <div className="result-card original-image-card">
          <h3>Original Image</h3>
          <img src={imagePreview} alt="Original" className="result-image" />
        </div>

        {/* Prediction Result */}
        <div className="result-card prediction-card">
          <h3>AI Prediction</h3>
          <div className="prediction-content">
            <div className="predicted-class">
              <p className="label">Diagnosis:</p>
              <p className="value">{predicted_class}</p>
            </div>

            <div className="confidence-section">
              <p className="label">Confidence Score:</p>
              <div className="confidence-bar-container">
                <div className="confidence-bar">
                  <div
                    className={`confidence-fill ${
                      confidencePercent >= 80
                        ? "high"
                        : confidencePercent >= 60
                        ? "moderate"
                        : "low"
                    }`}
                    style={{ width: `${confidencePercent}%` }}
                  ></div>
                </div>
                <p className="confidence-value">{confidencePercent}%</p>
              </div>
              <p className="confidence-status">{getConfidenceStatus(confidencePercent)}</p>
            </div>

            {message && <p className="prediction-message">{message}</p>}
          </div>
        </div>

        {/* Class Probabilities */}
        {class_probabilities && Object.keys(class_probabilities).length > 0 && (
          <div className="result-card probabilities-card">
            <h3>Class Probabilities</h3>
            <div className="probabilities-list">
              {Object.entries(class_probabilities).map(([className, prob]) => (
                <div key={className} className="probability-item">
                  <span className="class-name">{className}</span>
                  <div className="prob-bar-container">
                    <div className="prob-bar">
                      <div
                        className="prob-fill"
                        style={{ width: `${Math.round(prob * 100)}%` }}
                      ></div>
                    </div>
                    <span className="prob-value">{Math.round(prob * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Heatmap (Grad-CAM) */}
        {heatmap_image && (
          <div className="result-card heatmap-card">
            <h3>Attention Heatmap (Grad-CAM)</h3>
            <p className="heatmap-description">
              Highlighted areas showing where the model focused for prediction
            </p>
            <img src={`data:image/png;base64,${heatmap_image}`} alt="Heatmap" className="heatmap-image" />
          </div>
        )}
      </div>

      {/* Medical Information Card */}
      <div className="medical-info-card">
        <h3>📋 About This Prediction</h3>
        <ul>
          <li>
            <strong>Purpose:</strong> This analysis provides AI-assisted preliminary
            insights only
          </li>
          <li>
            <strong>Accuracy:</strong> Results depend on image quality and clarity
          </li>
          <li>
            <strong>Consultation Required:</strong> Always consult a qualified radiologist
            or medical professional
          </li>
          <li>
            <strong>Not a Diagnosis:</strong> This tool supports clinical assessment, not
            diagnosis
          </li>
        </ul>
      </div>
    </div>
  )
}

export default PredictionResult
