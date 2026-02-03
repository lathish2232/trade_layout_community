interface TagBadgeProps {
  tag: string
  size?: 'sm' | 'md'
  removable?: boolean
  onRemove?: () => void
}

export default function TagBadge({ tag, size = 'md', removable = false, onRemove }: TagBadgeProps) {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
  
  return (
    <span className={`inline-flex items-center rounded-md bg-gray-100 text-gray-700 font-medium ${sizeClass}`}>
      #{tag}
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </span>
  )
}
