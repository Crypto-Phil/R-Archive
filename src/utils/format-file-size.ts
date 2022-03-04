function formatFileSize(size: number) {
  if (size > 1_000_000) {
    return `${Math.ceil(size / 1024 / 1024)} MB`
  } else if (size > 1_000) {
    return `${Math.ceil(size / 1024)} KB`
  }
  return `${size} bytes`
}

export { formatFileSize }
