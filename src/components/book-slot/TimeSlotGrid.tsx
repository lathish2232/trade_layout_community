"use client"

interface TimeSlot {
  time: string
  available: boolean
}

interface TimeSlotGridProps {
  selectedTime: string
  onTimeSelect: (time: string) => void
  availableSlots: TimeSlot[]
  loading: boolean
}

export default function TimeSlotGrid({ selectedTime, onTimeSelect, availableSlots, loading }: TimeSlotGridProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          2️⃣ Available Time Slots
        </h2>
        
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        2️⃣ Available Time Slots
      </h2>
      
      {availableSlots.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {availableSlots.map((slot, index) => (
            <button
              key={index}
              onClick={() => slot.available && onTimeSelect(slot.time)}
              disabled={!slot.available}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedTime === slot.time
                  ? 'bg-blue-500 text-white border-blue-500'
                  : slot.available
                  ? 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              }`}
            >
              <div className="text-center">
                <div className="font-semibold">{slot.time}</div>
                <div className="text-xs mt-1">
                  {slot.available ? 'Available' : 'Booked'}
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 20 20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V12a2 2 0 01-2-2H6a2 2 0 01-2 2v8a2 2 0 01 2 2h8a2 2 0 01 2-2v-8a2 2 0 01 2-2H6a2 2 0 01-2-2z" />
          </svg>
          <p>No available slots for this date</p>
        </div>
      )}
    </div>
  )
}
