import React, { useState } from "react"
import ImageUpload from "../components/ImageUpload"
import PredictionResult from "../components/PredictionResult"
import { useTheme } from "../contexts/ThemeContext"
import "./XRayClassifier.css"

const XRayClassifier = () => {
  const { isDarkMode } = useTheme()
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [prediction, setPrediction] = useState(null)
  const [error, setError] = useState(null)

  const handleImageSelect = (file, preview) => {
    setImageFile(file)
    setImagePreview(preview)
    setPrediction(null)
    setError(null)
  }

  const handlePredict = async () => {
    if (!imageFile) {
      setError("Please upload an image first")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", imageFile)

      const response = await fetch(`${process.env.REACT_APP_API_URL}/predict-image`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Prediction failed")
      }

      const data = await response.json()
      setPrediction(data)
    } catch (err) {
      setError(err.message || "Error processing image. Please try again.")
      console.error("Prediction error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setImageFile(null)
    setImagePreview(null)
    setPrediction(null)
    setError(null)
  }

  return (
    <div className={`xray-classifier ${isDarkMode ? "dark" : ""}`}>
      <div className="xray-container">
        <div className="xray-header">
          <h1 className="xray-title">X-Ray Image Classifier</h1>
          <p className="xray-subtitle">
            Upload medical images for AI-powered analysis and diagnosis prediction
          </p>
        </div>

        <div className="xray-content">
          <div className="upload-section">
            <ImageUpload
              onImageSelect={handleImageSelect}
              imagePreview={imagePreview}
              loading={loading}
              onPredict={handlePredict}
            />
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {prediction && (
            <PredictionResult prediction={prediction} imagePreview={imagePreview} />
          )}

          {(imagePreview || prediction) && (
            <button className="reset-button" onClick={handleReset} disabled={loading}>
              Clear & Upload New Image
            </button>
          )}
        </div>

        <div className="medical-disclaimer">
          <p>
            <strong>⚠️ Medical Disclaimer:</strong> This AI-powered tool is designed to
            assist healthcare professionals and should not be used as a substitute for
            professional medical diagnosis. Always consult with qualified medical
            practitioners for accurate diagnosis and treatment.
          </p>
        </div>
      </div>
    </div>
  )
}

export default XRayClassifier
