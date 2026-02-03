export default function LayoutGrid() {
  const layouts = [
    {
      id: 1,
      title: "Day Trading Setup",
      author: "John Doe",
      description: "Optimized layout for day trading with multiple timeframes",
      likes: 245,
      category: "Day Trading"
    },
    {
      id: 2,
      title: "Swing Trading Dashboard",
      author: "Jane Smith",
      description: "Clean dashboard for swing trading analysis",
      likes: 189,
      category: "Swing Trading"
    },
    {
      id: 3,
      title: "Scalping Interface",
      author: "Mike Johnson",
      description: "Fast-paced layout for scalping strategies",
      likes: 156,
      category: "Scalping"
    },
    {
      id: 4,
      title: "Long-term Portfolio View",
      author: "Sarah Williams",
      description: "Comprehensive layout for portfolio management",
      likes: 203,
      category: "Position Trading"
    },
    {
      id: 5,
      title: "Crypto Trading Station",
      author: "Alex Chen",
      description: "Specialized layout for cryptocurrency markets",
      likes: 178,
      category: "Crypto"
    },
    {
      id: 6,
      title: "Options Analysis Board",
      author: "David Brown",
      description: "Advanced layout for options trading",
      likes: 134,
      category: "Options"
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Popular Trading Layouts</h2>
        <p className="mt-4 text-lg text-gray-600">
          Discover layouts shared by our community
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {layouts.map((layout) => (
          <div key={layout.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-indigo-600">{layout.category}</span>
                <span className="text-sm text-gray-500">❤️ {layout.likes}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{layout.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{layout.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">by {layout.author}</span>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  View Layout →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
