"use client"

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  selectedDate: string
  selectedTime: string
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, selectedDate, selectedTime }: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 m-4 max-w-md w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          5️⃣ Confirm Booking?
        </h3>
        
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Date</div>
            <div className="font-semibold text-gray-900">{selectedDate}</div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Time</div>
            <div className="font-semibold text-gray-900">{selectedTime}</div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Duration</div>
            <div className="font-semibold text-gray-900">30 minutes</div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
