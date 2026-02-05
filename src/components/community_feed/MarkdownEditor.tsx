'use client'

import { useState, useRef } from 'react'
import EmojiPicker from './EmojiPicker'
import MarkdownRenderer from './MarkdownRenderer'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  showPreview?: boolean
  minHeight?: string
}

export default function MarkdownEditor({ 
  value, 
  onChange, 
  placeholder = "Write your content here...",
  showPreview = false,
  minHeight = "200px"
}: MarkdownEditorProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('markdown-textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = before + selectedText + after
    
    const newValue = value.substring(0, start) + newText + value.substring(end)
    onChange(newValue)
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    // Create preview and upload
    const reader = new FileReader()
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string
      const imageMarkdown = `![${file.name}](${imageUrl})`
      insertMarkdown(imageMarkdown)
    }
    reader.readAsDataURL(file)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    insertMarkdown(emoji)
  }

  const toolbarButtons = [
    { icon: 'B', label: 'Bold', action: () => insertMarkdown('**', '**'), className: 'font-bold' },
    { icon: 'I', label: 'Italic', action: () => insertMarkdown('*', '*'), className: 'italic' },
    { icon: 'H', label: 'Heading', action: () => insertMarkdown('## ') },
    { icon: '🔗', label: 'Link', action: () => insertMarkdown('[', '](url)') },
    { icon: '</>', label: 'Code', action: () => insertMarkdown('`', '`') },
    { icon: '{}', label: 'Code Block', action: () => insertMarkdown('```\n', '\n```') },
    { icon: '"', label: 'Quote', action: () => insertMarkdown('> ') },
    { icon: '•', label: 'List', action: () => insertMarkdown('- ') },
    { icon: '1.', label: 'Numbered List', action: () => insertMarkdown('1. ') },
  ]

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {showPreview && (
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => setIsPreviewMode(false)}
              className={`px-3 py-1 text-sm font-medium rounded ${
                !isPreviewMode 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Write
            </button>
            <button
              onClick={() => setIsPreviewMode(true)}
              className={`px-3 py-1 text-sm font-medium rounded ${
                isPreviewMode 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Preview
            </button>
          </div>
        </div>
      )}

      {!isPreviewMode ? (
        <div>
          <div className="border-b border-gray-200 bg-gray-50 px-2 py-1 flex flex-wrap gap-1">
            {toolbarButtons.map((button, index) => (
              <button
                key={index}
                onClick={button.action}
                className={`px-2 py-1 text-xs font-mono text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded ${button.className || ''}`}
                title={button.label}
              >
                {button.icon}
              </button>
            ))}
            
            <div className="border-l border-gray-300 mx-1"></div>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2 py-1 text-xs font-mono text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
              title="Upload image"
            >
              📷
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
          </div>
          
          <textarea
            id="markdown-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 border-0 resize-none focus:ring-0 font-mono text-sm"
            style={{ minHeight }}
          />
          
          <div className="border-t border-gray-200 bg-gray-50 px-3 py-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div>
                💡 Tip: Use **bold**, *italic*, `code`, &gt; quotes, and upload images with 📷
              </div>
              <div>
                {value.length} characters
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 min-h-[200px]">
          <MarkdownRenderer content={value} />
        </div>
      )}
    </div>
  )
}
