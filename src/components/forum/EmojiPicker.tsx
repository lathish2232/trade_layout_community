'use client'

import { useState } from 'react'

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  buttonClassName?: string
}

const commonEmojis = [
  '😊', '😂', '❤️', '👍', '👎', '🔥', '🚀', '💰', '📈', '📉',
  '⚠️', 'ℹ️', '❓', '❗', '✅', '❌', '💡', '🎯', '🏆', '⭐',
  '✨', '⚡', '⚙️', '🔍', '🕐', '📅', '🔔', '📢', '📧', '🌐',
  '🔗', '🔒', '🔓', '🔑', '🛡️', '📦', '🚚', '✈️', '🚗', '🚂',
  '💪', '🧠', '👁️', '👂', '👄', '✋', '👋', '👏', '🙏', '👌',
  '✌️', '💯', '🥇', '🥈', '🥉', '🎨', '🎭', '🎪', '🎯', '🎲',
  '🃏', '🀄', '🎴', '🎱', '🔮', '🎰', '🎳', '🎯', '🎪', '🎭',
  '📊', '📈', '📉', '📋', '📌', '📍', '📎', '📏', '📐', '🔧',
  '🔨', '⚒️', '🛠️', '⛏️', '🔩', '⚙️', '🧱', '⛓️', '🧲', '🔬',
  '🔭', '📡', '🛰️', '🚀', '🛸', '🌌', '🌠', '☄️', '🌍', '🌎',
  '🌏', '🌐', '🗺️', '🧭', '🏔️', '⛰️', '🌋', '🗻', '🏕️', '🏖️',
  '🏜️', '🌋', '⛰️', '🏔️', '🗻', '🏕️', '🏖️', '🏜️', '🌲', '🌳',
  '🌴', '🌵', '🌾', '🌿', '🍀', '🍁', '🍂', '🍃', '🌱', '🌼',
  '🌻', '🌺', '🌸', '🌷', '🌹', '🥀', '🌾', '🌿', '🍀', '🍁'
]

const categories = [
  { name: 'Smiles', emojis: ['😊', '😂', '😍', '🤣', '😃', '😄', '😁', '😆', '😅', '😂', '🥰', '😘', '😗', '😙', '😚'] },
  { name: 'Trading', emojis: ['📈', '📉', '💰', '💵', '💶', '💷', '💴', '🪙', '💎', '🏦', '💳', '💱', '💲', '💹', '📊'] },
  { name: 'Reactions', emojis: ['👍', '👎', '❤️', '🔥', '🚀', '✅', '❌', '⚠️', '💡', '🎯', '👏', '🙌', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️', '🖖', '👋', '🤙', '💪', '🙏'] },
  { name: 'Objects', emojis: ['⚙️', '🔧', '🔨', '🛠️', '📊', '📋', '📌', '📍', '🔗', '🔒', '🔓', '🔑', '🛡️', '📦', '🚚', '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '🎥', '🎞️', '📽️', '🎬', '📹', '📼', '📷', '📸', '📹', '📼', '🔍', '🔎', '🕯️', '💡', '🔦', '🏮', '🪔', '📔', '📕', '📗', '📘', '📙', '📚', '📓', '📜', '📃', '📄', '📰', '🗞️', '📑', '🔖', '🏷️', '💰', '🪙', '💴', '💵', '💶', '💷', '💸', '💳', '🧾', '💹'] },
]

export default function EmojiPicker({ onEmojiSelect, buttonClassName = '' }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji)
    setIsOpen(false)
  }

  const getEmojisForCategory = () => {
    let emojis = []
    
    if (activeCategory === 'All') {
      emojis = commonEmojis
    } else {
      const category = categories.find(cat => cat.name === activeCategory)
      emojis = category ? category.emojis : []
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      emojis = emojis.filter(emoji => 
        emoji.includes(searchQuery) || 
        getEmojiName(emoji).toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    return emojis
  }

  const getEmojiName = (emoji: string) => {
    const emojiNames: Record<string, string> = {
      '😊': 'smile',
      '😂': 'laughing',
      '❤️': 'heart',
      '👍': 'thumbs up',
      '👎': 'thumbs down',
      '🔥': 'fire',
      '🚀': 'rocket',
      '💰': 'money',
      '📈': 'chart up',
      '📉': 'chart down',
      '⚠️': 'warning',
      'ℹ️': 'info',
      '❓': 'question',
      '❗': 'exclamation',
      '✅': 'check',
      '❌': 'x',
      '💡': 'bulb',
      '🎯': 'target',
      '🏆': 'trophy',
      '⭐': 'star',
      '✨': 'sparkles',
      '⚡': 'lightning',
      '⚙️': 'gear',
      '🔍': 'search',
      '🕐': 'clock',
      '📅': 'calendar',
      '🔔': 'bell',
      '📢': 'loudspeaker',
      '📧': 'email',
      '🌐': 'globe',
      '🔗': 'link',
      '🔒': 'lock',
      '🔓': 'unlock',
      '🔑': 'key',
      '🛡️': 'shield',
      '📦': 'package',
      '🚚': 'truck',
      '✈️': 'airplane',
      '🚗': 'car',
      '🚂': 'train',
      '💪': 'muscle',
      '🧠': 'brain',
      '👁️': 'eye',
      '👂': 'ear',
      '👄': 'mouth',
      '✋': 'hand',
      '👋': 'wave',
      '👏': 'clap',
      '🙏': 'pray',
      '👌': 'ok',
      '✌️': 'victory',
      '💯': 'hundred',
      '🥇': 'first',
      '🥈': 'second',
      '🥉': 'third',
    }
    
    return emojiNames[emoji] || emoji
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-2 py-1 text-xs font-mono text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded ${buttonClassName}`}
        title="Add emoji"
      >
        😊
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 left-0 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-3 w-80">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-medium text-gray-900">Choose Emoji</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="flex flex-wrap gap-1 mb-2 border-b border-gray-200 pb-2">
            <button
              onClick={() => {
                setActiveCategory('All')
                setSearchQuery('')
              }}
              className={`px-2 py-1 text-xs font-medium rounded ${
                activeCategory === 'All'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => {
                  setActiveCategory(category.name)
                  setSearchQuery('')
                }}
                className={`px-2 py-1 text-xs font-medium rounded ${
                  activeCategory === category.name
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto mb-2">
            {getEmojisForCategory().map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                className="p-1 text-sm hover:bg-gray-100 rounded transition-all duration-200 min-h-[24px] min-w-[24px] flex items-center justify-center relative group"
                title={getEmojiName(emoji)}
              >
                {emoji}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                  {getEmojiName(emoji)}
                </div>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-200">
            <input
              type="text"
              placeholder="Search emojis..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}
