interface CategoryBadgeProps {
  category: string
  size?: 'sm' | 'md'
}

const categoryColors: Record<string, string> = {
  'General': 'bg-blue-100 text-blue-800',
  'Strategies': 'bg-green-100 text-green-800',
  'Technical Analysis': 'bg-purple-100 text-purple-800',
  'Market News': 'bg-red-100 text-red-800',
  'Beginners': 'bg-yellow-100 text-yellow-800',
  'Tools & Platforms': 'bg-indigo-100 text-indigo-800',
  'Pricing Related': 'bg-orange-100 text-orange-800',
}

export default function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  const colorClass = categoryColors[category] || 'bg-gray-100 text-gray-800'
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-sm'
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClass} transition-colors duration-200`}>
      {category}
    </span>
  )
}
