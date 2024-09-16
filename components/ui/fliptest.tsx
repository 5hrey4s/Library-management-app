"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SimpleFlipCard() {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => setIsFlipped(!isFlipped)

  return (
    <div 
      className="w-[300px] h-[400px] perspective-1000 cursor-pointer"
      onClick={handleFlip}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleFlip()
        }
      }}
      tabIndex={0}
      role="button"
      aria-label="Flip card"
    >
      <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front of the card */}
        <Card className="absolute w-full h-full backface-hidden">
          <CardContent className="flex flex-col items-center justify-center h-full p-6">
            <h2 className="text-2xl font-bold mb-4">Front Side</h2>
            <p className="text-center mb-4">Click the card to flip it!</p>
            <img
              src="/placeholder.svg?height=100&width=100"
              alt="Front side image"
              className="w-24 h-24 object-cover rounded-full"
            />
          </CardContent>
        </Card>

        {/* Back of the card */}
        <Card className="absolute w-full h-full backface-hidden rotate-y-180">
          <CardContent className="flex flex-col items-center justify-center h-full p-6">
            <h2 className="text-2xl font-bold mb-4">Back Side</h2>
            <p className="text-center mb-4">You've flipped the card!</p>
            <Button onClick={(e) => { e.stopPropagation(); alert('Button clicked!'); }}>
              Click Me
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}