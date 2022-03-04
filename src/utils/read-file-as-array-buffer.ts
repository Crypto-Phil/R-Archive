function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = () => {
      const result = fileReader.result as ArrayBuffer
      if (result === null) {
        throw new Error(`Incompatible result. Result is: ${result}`)
      }
      resolve(result)
    }
    fileReader.onerror = reject
    fileReader.readAsArrayBuffer(file)
  })
}

export { readFileAsArrayBuffer }
