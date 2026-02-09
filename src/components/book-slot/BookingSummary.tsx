"use client"

interface BookingSummaryProps {
  selectedDate: string
  selectedTime: string
}

export default function BookingSummary({ selectedDate, selectedTime }: BookingSummaryProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        3️⃣ Booking Summary
      </h2>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <div className="text-sm text-gray-600">Date</div>
            <div className="font-semibold text-gray-900">{selectedDate}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Time</div>
            <div className="font-semibold text-gray-900">{selectedTime}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <div className="text-sm text-gray-600">Duration</div>
            <div className="font-semibold text-gray-900">30 minutes</div>
          </div>
        </div>
      </div>
    </div>
  )
}
