"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface InteractiveGridPatternProps {
  className?: string
  width?: number
  height?: number
  x?: number
  y?: number
  strokeDasharray?: string
  squares?: [number, number]
  squaresClassName?: string
}

interface SquarePosition {
  id: number
  pos: [number, number]
  color: string
}

export function InteractiveGridPattern({
  className,
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = "0",
  squares = [50, 50],
  squaresClassName = "fill-gray-200/10",
  ...props
}: InteractiveGridPatternProps) {
  const [squarePositions, setSquarePositions] = useState<Array<SquarePosition>>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const generateSquares = () => {
      if (!containerRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      const containerHeight = containerRef.current.offsetHeight

      const cols = Math.floor(containerWidth / width)
      const rows = Math.floor(containerHeight / height)

      const [numCols, numRows] = squares
      const numSquares = Math.min(numCols * numRows, cols * rows)

      const colors = [
        "fill-gray-200/10",
        "fill-gray-300/10",
        "fill-slate-200/10",
        "fill-blue-100/15",
        "fill-purple-100/15",
        "fill-pink-100/15",
        "fill-white/10",
      ]

      const newSquares = Array.from({ length: numSquares }, (_, i) => ({
        id: i,
        pos: [
          Math.floor(Math.random() * cols) * width,
          Math.floor(Math.random() * rows) * height,
        ] as [number, number],
        color: colors[Math.floor(Math.random() * colors.length)],
      }))

      setSquarePositions(newSquares)
    }

    generateSquares()

    const handleResize = () => generateSquares()
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [width, height, squares])

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      {...props}
    >
      <svg className="absolute inset-0 h-full w-full">
        <defs>
          <pattern
            id="grid-pattern"
            width={width}
            height={height}
            patternUnits="userSpaceOnUse"
            x={x}
            y={y}
          >
            <path
              d={`M ${width} 0 L 0 0 0 ${height}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray={strokeDasharray}
              className="text-gray-300 dark:text-gray-700"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        {squarePositions.map(({ id, pos, color }) => (
          <rect
            key={id}
            width={width - 1}
            height={height - 1}
            x={pos[0]}
            y={pos[1]}
            strokeWidth="0"
            className={cn("transition-colors duration-300", color)}
          />
        ))}
      </svg>
    </div>
  )
}
