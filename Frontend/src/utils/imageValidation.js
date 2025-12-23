export const validateImage = (file) => {
  // Check if file exists
  if (!file) {
    return {
      valid: false,
      error: "No file selected",
    }
  }

  // Allowed file types
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"]

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Please upload JPG, PNG, GIF, or WebP image.",
    }
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB in bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds 10MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`,
    }
  }

  // Check minimum file size (at least 50KB to avoid very small/low-quality images)
  const minSize = 50 * 1024 // 50KB in bytes
  if (file.size < minSize) {
    return {
      valid: false,
      error: "File size is too small. Please upload a higher quality image.",
    }
  }

  return {
    valid: true,
    error: null,
  }
}

export const getFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes, k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}
