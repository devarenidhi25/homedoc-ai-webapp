import React, { useState } from "react"
import { validateImage } from "../utils/imageValidation"
import "./ImageUpload.css"

const ImageUpload = ({ onImageSelect, imagePreview, loading, onPredict }) => {
  const [dragActive, setDragActive] = useState(false)
  const [validationError, setValidationError] = useState(null)

  const handleFile = (file) => {
    const validation = validateImage(file)

    if (!validation.valid) {
      setValidationError(validation.error)
      return
    }

    setValidationError(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      onImageSelect(file, e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  return (
    <div className="image-upload">
      {!imagePreview ? (
        <div
          className={`upload-area ${dragActive ? "active" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="upload-content">
            <div className="upload-icon">
                <i className="fas fa-cloud-upload-alt"></i>
            </div>
            <h3>Upload Medical Image</h3>
            <p>Drag and drop your X-ray, MRI, or medical image here</p>
            <p className="upload-hint">or</p>
            <label className="upload-button">
              Click to Browse
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                onChange={handleInputChange}
                hidden
              />
            </label>
            <p className="file-info">
              Supported formats: JPG, PNG, GIF, WebP (Max 10MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="image-preview-section">
          <div className="preview-container">
            <img src={imagePreview} alt="Preview" className="preview-image" />
            <div className="preview-info">
              <p className="preview-status">✓ Image Ready for Analysis</p>
            </div>
          </div>
        </div>
      )}

      {validationError && (
        <div className="validation-error">
          <span className="error-icon">❌</span>
          {validationError}
        </div>
      )}

      {imagePreview && (
        <button
          className="predict-button"
          onClick={onPredict}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Analyzing Image...
            </>
          ) : (
            <>
              🔍 Analyze & Predict
            </>
          )}
        </button>
      )}
    </div>
  )
}

export default ImageUpload
