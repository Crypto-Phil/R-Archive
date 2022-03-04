import React from 'react'

interface FileInputProps {
  name: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  label: string
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(({ name, onChange, label }, ref) => {
  return (
    <button type="button" className="w-64">
      <label
        className="flex items-center justify-center py-2 px-4 rounded shadow-md bg-orange-500 text-white font-semibold hover:cursor-pointer hover:bg-orange-400"
        htmlFor="file-upload"
      >
        {label}
      </label>
      <input className="hidden" id="file-upload" type="file" ref={ref} name={name} onChange={onChange} />
    </button>
  )
})

FileInput.displayName = 'FileInput'

export { FileInput, FileInputProps }
