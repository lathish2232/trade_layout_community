'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useState } from 'react'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  // Convert emojis to actual emoji characters
  const convertEmojis = (text: string) => {
    const emojiMap: Record<string, string> = {
      ':smile:': '😊',
      ':thumbs_up:': '👍',
      ':thumbs_down:': '👎',
      ':heart:': '❤️',
      ':fire:': '🔥',
      ':rocket:': '🚀',
      ':chart_with_upwards_trend:': '📈',
      ':chart_with_downwards_trend:': '📉',
      ':moneybag:': '💰',
      ':dollar:': '💵',
      ':euro:': '💶',
      ':pound:': '💷',
      ':yen:': '💴',
      ':warning:': '⚠️',
      ':info:': 'ℹ️',
      ':question:': '❓',
      ':exclamation:': '❗',
      ':check_mark:': '✅',
      ':x:': '❌',
      ':bulb:': '💡',
      ':target:': '🎯',
      ':trophy:': '🏆',
      ':medal:': '🥇',
      ':star:': '⭐',
      ':sparkles:': '✨',
      ':zap:': '⚡',
      ':gear:': '⚙️',
      ':hammer:': '🔨',
      ':magnifying_glass:': '🔍',
      ':clock:': '🕐',
      ':calendar:': '📅',
      ':bell:': '🔔',
      ':loudspeaker:': '📢',
      ':email:': '📧',
      ':phone:': '📞',
      ':globe:': '🌐',
      ':link:': '🔗',
      ':lock:': '🔒',
      ':unlock:': '🔓',
      ':key:': '🔑',
      ':shield:': '🛡️',
      ':package:': '📦',
      ':truck:': '🚚',
      ':airplane:': '✈️',
      ':ship:': '🚢',
      ':car:': '🚗',
      ':train:': '🚂',
      ':bike:': '🚴',
      ':walking:': '🚶',
      ':running:': '🏃',
      ':muscle:': '💪',
      ':brain:': '🧠',
      ':eye:': '👁️',
      ':ear:': '👂',
      ':mouth:': '👄',
      ':hand:': '✋',
      ':wave:': '👋',
      ':clap:': '👏',
      ':pray:': '🙏',
      '+1': '👍',
      '-1': '👎',
      ':100:': '💯',
      ':ok_hand:': '👌',
      ':victory:': '✌️',
      ':peace:': '☮️',
    }

    let processedText = text
    Object.entries(emojiMap).forEach(([emojiCode, emojiChar]) => {
      processedText = processedText.replace(new RegExp(emojiCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), emojiChar)
    })

    return processedText
  }

  const handleImageError = (src: string) => {
    setImageErrors(prev => new Set(prev).add(src))
  }

  const components = {
    // Custom image component with error handling
    img: ({ src, alt, ...props }: any) => {
      if (imageErrors.has(src)) {
        return (
          <div className="inline-block border border-gray-300 rounded-md p-4 text-center bg-gray-50">
            <div className="text-gray-500 text-sm">
              📷 Image failed to load
            </div>
            {alt && <div className="text-xs text-gray-400 mt-1">{alt}</div>}
          </div>
        )
      }

      return (
        <img
          src={src}
          alt={alt}
          onError={() => handleImageError(src)}
          className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200 my-4"
          {...props}
        />
      )
    },

    // Custom code block with syntax highlighting
    code: ({ inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : ''

      if (!inline && language) {
        return (
          <div className="relative">
            <div className="absolute top-2 right-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {language}
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">
              <code className={className} {...props}>
                {children}
              </code>
            </pre>
          </div>
        )
      }

      return (
        <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      )
    },

    // Custom blockquote
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-indigo-500 pl-4 py-2 my-4 bg-indigo-50 italic">
        {children}
      </blockquote>
    ),

    // Custom table
    table: ({ children }: any) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border border-gray-300 rounded-lg">
          {children}
        </table>
      </div>
    ),

    th: ({ children }: any) => (
      <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-medium">
        {children}
      </th>
    ),

    td: ({ children }: any) => (
      <td className="border border-gray-300 px-4 py-2">
        {children}
      </td>
    ),

    // Custom list styling
    ul: ({ children }: any) => (
      <ul className="list-disc list-inside my-4 space-y-1">
        {children}
      </ul>
    ),

    ol: ({ children }: any) => (
      <ol className="list-decimal list-inside my-4 space-y-1">
        {children}
      </ol>
    ),

    // Custom heading styles
    h1: ({ children }: any) => (
      <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-4 border-b border-gray-200 pb-2">
        {children}
      </h1>
    ),

    h2: ({ children }: any) => (
      <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">
        {children}
      </h2>
    ),

    h3: ({ children }: any) => (
      <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
        {children}
      </h3>
    ),

    // Custom paragraph
    p: ({ children }: any) => (
      <p className="my-4 text-gray-700 leading-relaxed">
        {children}
      </p>
    ),

    // Custom link
    a: ({ href, children }: any) => (
      <a
        href={href}
        className="text-indigo-600 hover:text-indigo-800 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),

    // Custom horizontal rule
    hr: () => (
      <hr className="border-gray-300 my-6" />
    ),

    // Custom strong (bold) - ensure proper styling
    strong: ({ children }: any) => (
      <strong className="font-bold text-gray-900">
        {children}
      </strong>
    ),

    // Custom emphasis (italic) - ensure proper styling
    em: ({ children }: any) => (
      <em className="italic text-gray-700">
        {children}
      </em>
    ),
  }

  const processedContent = convertEmojis(content)

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}
