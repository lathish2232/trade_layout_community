'use client'

import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faBold, 
  faItalic, 
  faUnderline, 
  faStrikethrough,
  faHeading,
  faListUl,
  faListOl,
  faQuoteLeft,
  faCode,
  faPaperclip,
  faImage,
  faFilePdf,
  faFileCsv,
  faFileAlt,
  faFileArchive,
  faFileWord,
  faDownload
} from '@fortawesome/free-solid-svg-icons'
import EmojiPicker from './EmojiPicker'
import MarkdownRenderer from './MarkdownRenderer'

interface HybridEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

interface ToolbarButton {
  icon: React.ReactNode
  label: string
  command?: string
  value?: string
  action?: string
  className?: string
}

export default function HybridEditor({ 
  value, 
  onChange, 
  placeholder = "Write your content here...",
  minHeight = "200px"
}: HybridEditorProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editorRef.current && !isPreviewMode) {
      // Only set content if it's different and editor is not focused
      if (editorRef.current.innerHTML !== value && document.activeElement !== editorRef.current) {
        editorRef.current.innerHTML = value
      }
    }
  }, [value, isPreviewMode])

  // Initialize editor content on mount
  useEffect(() => {
    if (editorRef.current && !isPreviewMode && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value
    }
  }, [])

  const handleInput = () => {
    if (editorRef.current && !isPreviewMode) {
      let content = editorRef.current.innerHTML
      
      // Auto-convert URLs to links on paste/type
      content = content.replace(
        /(https?:\/\/[^\s<]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-700 underline">$1</a>'
      )
      
      // Also handle www URLs
      content = content.replace(
        /(www\.[^\s<]+)/g,
        '<a href="https://$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-700 underline">$1</a>'
      )
      
      onChange(content)
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value || '')
    handleInput()
    editorRef.current?.focus()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    
    // Allow all file types - no restrictions
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size should be less than 10MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const fileData = event.target?.result as string
      
      // Use setTimeout to ensure this runs completely separate from any form events
      setTimeout(() => {
        if (editorRef.current) {
          if (file.type.startsWith('image/')) {
            // For images, insert as img tag using safer method
            const imgHtml = `<img src="${fileData}" alt="${file.name}" style="max-width: 100%; height: auto;" />`
            const selection = window.getSelection()
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0)
              const tempDiv = document.createElement('div')
              tempDiv.innerHTML = imgHtml
              if (tempDiv.firstChild) {
                range.insertNode(tempDiv.firstChild)
                range.collapse(true)
              }
            } else if (editorRef.current) {
              const tempDiv = document.createElement('div')
              tempDiv.innerHTML = imgHtml
              editorRef.current.appendChild(tempDiv)
              editorRef.current.focus()
            }
          } else {
            // For other files (PDF, CSV, etc.), insert as download link
            const fileIconElement = getFileIcon(file.type)
            const linkHtml = `<div style="margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px; background: #f9f9f9;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">${fileIconElement}</span>
                <div>
                  <div style="font-weight: bold; color: #333;">${file.name}</div>
                  <div style="font-size: 12px; color: #666;">${(file.size / 1024).toFixed(1)} KB</div>
                </div>
              </div>
              <a href="${fileData}" download="${file.name}" style="display: inline-block; margin-top: 10px; padding: 5px 15px; background: #007bff; color: white; text-decoration: none; border-radius: 3px;">
                <FontAwesomeIcon icon={faDownload} /> Download
              </a>
            </div>`
            
            // Use safer method to insert HTML without triggering form submission
            const selection = window.getSelection()
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0)
              const tempDiv = document.createElement('div')
              tempDiv.innerHTML = linkHtml
              if (tempDiv.firstChild) {
                range.insertNode(tempDiv.firstChild)
                range.collapse(true)
              }
            } else if (editorRef.current) {
              const tempDiv = document.createElement('div')
              tempDiv.innerHTML = linkHtml
              editorRef.current.appendChild(tempDiv)
              editorRef.current.focus()
            }
          }
        }
      }, 100) // 100ms delay to ensure complete separation from form events
    }
    reader.readAsDataURL(file)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <FontAwesomeIcon icon={faImage} />
    if (fileType === 'application/pdf') return <FontAwesomeIcon icon={faFilePdf} />
    if (fileType.includes('text/csv') || fileType.includes('excel')) return <FontAwesomeIcon icon={faFileCsv} />
    if (fileType.includes('text/')) return <FontAwesomeIcon icon={faFileAlt} />
    if (fileType.includes('zip') || fileType.includes('compressed')) return <FontAwesomeIcon icon={faFileArchive} />
    if (fileType.includes('word') || fileType.includes('document')) return <FontAwesomeIcon icon={faFileWord} />
    return <FontAwesomeIcon icon={faPaperclip} /> // Default attachment icon
  }

  const handleEmojiSelect = (emoji: string) => {
    execCommand('insertText', emoji)
  }

  const toolbarButtons: ToolbarButton[] = [
    { icon: <FontAwesomeIcon icon={faBold} />, label: 'Bold', command: 'bold', className: 'font-bold' },
    { icon: <FontAwesomeIcon icon={faItalic} />, label: 'Italic', command: 'italic', className: 'italic' },
    { icon: <FontAwesomeIcon icon={faUnderline} />, label: 'Underline', command: 'underline', className: 'underline' },
    { icon: <FontAwesomeIcon icon={faStrikethrough} />, label: 'Strikethrough', command: 'strikeThrough', className: 'line-through' },
    { icon: <FontAwesomeIcon icon={faHeading} />, label: 'Heading 1', command: 'formatBlock', value: 'h1' },
    { icon: <FontAwesomeIcon icon={faHeading} />, label: 'Heading 2', command: 'formatBlock', value: 'h2' },
    { icon: <FontAwesomeIcon icon={faHeading} />, label: 'Heading 3', command: 'formatBlock', value: 'h3' },
    { icon: <FontAwesomeIcon icon={faListUl} />, label: 'Bullet List', command: 'insertUnorderedList' },
    { icon: <FontAwesomeIcon icon={faListOl} />, label: 'Numbered List', command: 'insertOrderedList' },
    { icon: <FontAwesomeIcon icon={faQuoteLeft} />, label: 'Quote', command: 'formatBlock', value: 'blockquote' },
    { icon: <FontAwesomeIcon icon={faCode} />, label: 'Code', command: 'formatBlock', value: 'pre' },
    { icon: <FontAwesomeIcon icon={faImage} />, label: 'Insert Image', action: 'image' },
  ]

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 px-2 py-1 flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (button.action === 'image') {
                  fileInputRef.current?.click()
                } else if (button.command) {
                  if (button.value) {
                    execCommand(button.command, button.value)
                  } else {
                    execCommand(button.command)
                  }
                }
              }}
              className={`px-2 py-1 text-xs font-mono text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-all duration-200 ${button.className || ''}`}
              title={button.label}
            >
              {button.icon}
            </button>
          ))}
          
          <div className="border-l border-gray-300 mx-1"></div>
          
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        </div>
        
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setIsPreviewMode(false)}
            className={`px-3 py-1 text-sm font-medium rounded transition-all duration-200 ${
              !isPreviewMode 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setIsPreviewMode(true)}
            className={`px-3 py-1 text-sm font-medium rounded transition-all duration-200 ${
              isPreviewMode 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Preview
          </button>
        </div>
      </div>
      
      <div className="flex">
        {!isPreviewMode ? (
          <div className="w-full p-4 border-0 resize-none focus:ring-0 min-h-[200px]">
            <div
              ref={editorRef}
              contentEditable
              onInput={handleInput}
              className="w-full prose prose-sm max-w-none min-h-[200px] outline-none"
              style={{ 
                minHeight,
                direction: 'ltr',
                unicodeBidi: 'plaintext'
              }}
              suppressContentEditableWarning={true}
              data-placeholder={placeholder}
            />
          </div>
        ) : (
          <div className="w-full p-4 min-h-[200px]">
            <MarkdownRenderer content={value} />
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 bg-gray-50 px-3 py-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div>
            💡 {isPreviewMode ? 'Preview mode - see how it will render' : 'Edit mode - format directly'}
          </div>
          <div>
            {value.length} characters
          </div>
        </div>
      </div>
      
      {/* Hidden file input for image upload - accepts only image files */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*" // Accept only image files
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  )
}
