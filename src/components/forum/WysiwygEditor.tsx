'use client'

import { useState, useRef, useEffect } from 'react'
import EmojiPicker from './EmojiPicker'

interface WysiwygEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export default function WysiwygEditor({ 
  value, 
  onChange, 
  placeholder = "Write your content here...",
  minHeight = "200px"
}: WysiwygEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const execCommand = (command: string, value?: string | undefined) => {
    document.execCommand(command, false, value || '')
    handleInput()
    editorRef.current?.focus()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string
      execCommand('insertImage', imageUrl)
    }
    reader.readAsDataURL(file)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    execCommand('insertText', emoji)
  }

  const toolbarButtons = [
    { icon: 'B', label: 'Bold', command: 'bold', className: 'font-bold' },
    { icon: 'I', label: 'Italic', command: 'italic', className: 'italic' },
    { icon: 'U', label: 'Underline', command: 'underline', className: 'underline' },
    { icon: 'S', label: 'Strikethrough', command: 'strikeThrough', className: 'line-through' },
    { icon: 'H1', label: 'Heading 1', command: 'formatBlock', value: 'h1' },
    { icon: 'H2', label: 'Heading 2', command: 'formatBlock', value: 'h2' },
    { icon: 'H3', label: 'Heading 3', command: 'formatBlock', value: 'h3' },
    { icon: '•', label: 'Bullet List', command: 'insertUnorderedList' },
    { icon: '1.', label: 'Numbered List', command: 'insertOrderedList' },
    { icon: '"', label: 'Quote', command: 'formatBlock', value: 'blockquote' },
    { icon: '</>', label: 'Code', command: 'formatBlock', value: 'pre' },
    { icon: '🔗', label: 'Link', command: 'createLink' },
    { icon: '🖼️', label: 'Image', action: 'image' },
  ]

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 px-2 py-1 flex flex-wrap gap-1">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            onClick={() => button.action === 'image' ? fileInputRef.current?.click() : execCommand(button.command, button.value)}
            className={`px-2 py-1 text-xs font-mono text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-all duration-200 ${button.className || ''}`}
            title={button.label}
          >
            {button.icon}
          </button>
        ))}
        
        <div className="border-l border-gray-300 mx-1"></div>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-2 py-1 text-xs font-mono text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-all duration-200"
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
      
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="w-full p-4 border-0 resize-none focus:ring-0 min-h-[200px] prose prose-sm max-w-none"
        style={{ minHeight }}
        dangerouslySetInnerHTML={{ __html: value }}
      />
      
      <div className="border-t border-gray-200 bg-gray-50 px-3 py-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div>
            💡 Tip: Use the toolbar to format text directly
          </div>
          <div>
            {value.length} characters
          </div>
        </div>
      </div>
    </div>
  )
}
