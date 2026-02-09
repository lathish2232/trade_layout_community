"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CalendarPicker from '@/components/book-slot/CalendarPicker'
import TimeSlotGrid from '@/components/book-slot/TimeSlotGrid'
import BookingSummary from '@/components/book-slot/BookingSummary'
import ConfirmModal from '@/components/book-slot/ConfirmModal'

interface TimeSlot {
  time: string
  available: boolean
}

interface SlotResponse {
  date: string
  slots: TimeSlot[]
}

export default function BookSlotPage() {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate)
    }
  }, [selectedDate])

  const fetchAvailableSlots = async (date: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/slots?date=${date}`)
      if (response.ok) {
        const data: SlotResponse = await response.json()
        setAvailableSlots(data.slots)
      }
    } catch (error) {
      console.error('Error fetching slots:', error)
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/book-slot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate,
          time: selectedTime,
        }),
      })

      if (response.ok) {
        setBookingConfirmed(true)
        setShowConfirmModal(false)
        // Reset form
        setSelectedDate('')
        setSelectedTime('')
        setAvailableSlots([])
        setTimeout(() => setBookingConfirmed(false), 3000)
      } else {
        setShowError(true)
        setTimeout(() => setShowError(false), 3000)
      }
    } catch (error) {
      console.error('Booking error:', error)
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/profile"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 20 20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l-7 7m7-7-7 0" />
            </svg>
            Back to Profile
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Book a Slot with Product Owner
          </h1>
          <p className="text-gray-600">
            Schedule your consultation time with our product experts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Picker */}
          <CalendarPicker 
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />

          {/* Time Slot Grid */}
          {selectedDate && (
            <TimeSlotGrid
              selectedTime={selectedTime}
              onTimeSelect={setSelectedTime}
              availableSlots={availableSlots}
              loading={loading}
            />
          )}

          {/* Booking Summary */}
          {selectedDate && selectedTime && (
            <BookingSummary
              selectedDate={selectedDate}
              selectedTime={selectedTime}
            />
          )}

          {/* Book Slot Button */}
          {selectedDate && selectedTime && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                4️⃣ Book Slot
              </h2>
              
              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={loading || bookingConfirmed}
                className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : bookingConfirmed ? (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Booking Confirmed!
                  </div>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleBooking}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
      />

      {/* Success Toast */}
      {bookingConfirmed && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Booking confirmed successfully!
          </div>
        </div>
      )}

      {/* Error Toast */}
      {showError && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Something went wrong. Please try again.
          </div>
        </div>
      )}
    </div>
  )
}
