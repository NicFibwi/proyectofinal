"use client"

import type React from "react"
import { useState, useRef } from "react"
import { cn } from "~/lib/utils"

interface HoverCardEffectProps {
  children: React.ReactNode
  className?: string
}

export function HoverCardEffect({ children, className }: HoverCardEffectProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()

    // Calculate position relative to the card
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
    setOpacity(1)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setOpacity(0)
  }

  return (
    <div
      ref={cardRef}
      className={cn("relative overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.1), transparent 40%)`,
        }}
      />

      {/* Card content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

