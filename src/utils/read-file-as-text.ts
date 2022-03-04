function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = () => {
      const result = fileReader.result as string
      if (result === null) {
        throw new Error(`Incompatible result. Result is: ${result}`)
      }
      resolve(result)
    }
    fileReader.onerror = reject
    fileReader.readAsText(file)
  })
}

export { readFileAsText }
