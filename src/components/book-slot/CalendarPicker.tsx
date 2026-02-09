"use client"

interface CalendarPickerProps {
  selectedDate: string
  onDateChange: (date: string) => void
}

export default function CalendarPicker({ selectedDate, onDateChange }: CalendarPickerProps) {
  const getToday = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        1️⃣ Select Date
      </h2>
      
      <div className="space-y-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          min={getToday()}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        
        {selectedDate && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">
              Selected: {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
