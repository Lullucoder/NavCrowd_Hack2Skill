import { Camera, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { VenueArea, VenueBlueprint, VenueCheckpoint } from '../types/venue'

interface VenueMapProps {
  blueprint: VenueBlueprint
  selectedAreaId?: string
  onAreaSelect?: (areaId: string) => void
  showCCTV?: boolean
  navigationRoute?: {
    checkpoints: VenueCheckpoint[]
    currentIndex: number
  }
  showFullMap?: boolean
}

const getAreaColor = (level: VenueArea['level'], opacity = 0.3) => {
  switch (level) {
    case 'low':
      return `rgba(34, 197, 94, ${opacity})`
    case 'medium':
      return `rgba(245, 158, 11, ${opacity})`
    case 'high':
      return `rgba(239, 68, 68, ${opacity})`
    case 'critical':
      return `rgba(220, 38, 38, ${opacity})`
  }
}

const getAreaStrokeColor = (level: VenueArea['level']) => {
  switch (level) {
    case 'low':
      return 'rgba(34, 197, 94, 0.8)'
    case 'medium':
      return 'rgba(245, 158, 11, 0.8)'
    case 'high':
      return 'rgba(239, 68, 68, 0.8)'
    case 'critical':
      return 'rgba(220, 38, 38, 1)'
  }
}

export const VenueMap = ({
  blueprint,
  selectedAreaId,
  onAreaSelect,
  showCCTV = false,
  navigationRoute,
  showFullMap = true
}: VenueMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredArea, setHoveredArea] = useState<string | null>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 800 })

  useEffect(() => {
    const updateSize = () => {
      const container = canvasRef.current?.parentElement
      if (container) {
        const width = Math.min(container.clientWidth - 32, 800)
        const height = width
        setCanvasSize({ width, height })
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Scale factor
    const scaleX = canvas.width / blueprint.width
    const scaleY = canvas.height / blueprint.height

    // Draw background
    ctx.fillStyle = 'rgba(11, 19, 36, 0.5)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Filter areas if not showing full map
    const areasToShow = showFullMap
      ? blueprint.areas
      : selectedAreaId
      ? blueprint.areas.filter((a) => a.id === selectedAreaId || a.connectedTo.includes(selectedAreaId))
      : blueprint.areas

    // Draw areas
    areasToShow.forEach((area) => {
      const isSelected = area.id === selectedAreaId
      const isHovered = area.id === hoveredArea

      ctx.beginPath()
      area.polygon.forEach((point, index) => {
        const x = point.x * scaleX
        const y = point.y * scaleY
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.closePath()

      // Fill
      ctx.fillStyle = getAreaColor(area.level, isSelected ? 0.5 : isHovered ? 0.4 : 0.3)
      ctx.fill()

      // Stroke
      ctx.strokeStyle = getAreaStrokeColor(area.level)
      ctx.lineWidth = isSelected ? 3 : isHovered ? 2 : 1
      ctx.stroke()

      // Draw area label
      const centerX = area.polygon.reduce((sum, p) => sum + p.x, 0) / area.polygon.length * scaleX
      const centerY = area.polygon.reduce((sum, p) => sum + p.y, 0) / area.polygon.length * scaleY

      ctx.fillStyle = '#f1f5f9'
      ctx.font = 'bold 11px Inter'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(area.name, centerX, centerY - 8)

      // Draw occupancy
      ctx.font = '10px Inter'
      ctx.fillStyle = '#94a3b8'
      const occupancyPercent = Math.round((area.currentOccupancy / area.capacity) * 100)
      ctx.fillText(`${occupancyPercent}% (${area.currentOccupancy}/${area.capacity})`, centerX, centerY + 8)
    })

    // Draw CCTV cameras
    if (showCCTV) {
      blueprint.cctvFeeds.forEach((feed) => {
        if (!showFullMap && selectedAreaId && feed.areaId !== selectedAreaId) return

        const x = feed.position.x * scaleX
        const y = feed.position.y * scaleY

        // Camera icon background
        ctx.fillStyle = feed.status === 'active' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(148, 163, 184, 0.5)'
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.fill()

        // Camera pulse effect for active cameras
        if (feed.status === 'active') {
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(x, y, 12, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Detection count
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 9px Inter'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(String(feed.detectedCount), x, y)
      })
    }

    // Draw navigation route
    if (navigationRoute && navigationRoute.checkpoints.length > 0) {
      const checkpoints = navigationRoute.checkpoints

      // Draw path line
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)'
      ctx.lineWidth = 4
      ctx.setLineDash([10, 5])
      ctx.beginPath()

      checkpoints.forEach((checkpoint, index) => {
        const x = checkpoint.position.x * scaleX
        const y = checkpoint.position.y * scaleY

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()
      ctx.setLineDash([])

      // Draw checkpoints
      checkpoints.forEach((checkpoint, index) => {
        const x = checkpoint.position.x * scaleX
        const y = checkpoint.position.y * scaleY
        const isCurrent = index === navigationRoute.currentIndex
        const isPassed = index < navigationRoute.currentIndex

        // Checkpoint circle
        ctx.beginPath()
        ctx.arc(x, y, isCurrent ? 12 : 8, 0, Math.PI * 2)
        ctx.fillStyle = isCurrent
          ? 'rgba(34, 197, 94, 0.9)'
          : isPassed
          ? 'rgba(148, 163, 184, 0.6)'
          : 'rgba(59, 130, 246, 0.8)'
        ctx.fill()

        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 2
        ctx.stroke()

        // Current position pulse
        if (isCurrent) {
          ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)'
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.arc(x, y, 18, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Checkpoint number
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 10px Inter'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(String(index + 1), x, y)

        // Draw arrow between checkpoints
        if (index < checkpoints.length - 1 && !isPassed) {
          const nextCheckpoint = checkpoints[index + 1]
          const nextX = nextCheckpoint.position.x * scaleX
          const nextY = nextCheckpoint.position.y * scaleY

          const angle = Math.atan2(nextY - y, nextX - x)
          const arrowX = x + (nextX - x) * 0.5
          const arrowY = y + (nextY - y) * 0.5

          ctx.save()
          ctx.translate(arrowX, arrowY)
          ctx.rotate(angle)

          ctx.fillStyle = 'rgba(59, 130, 246, 0.9)'
          ctx.beginPath()
          ctx.moveTo(10, 0)
          ctx.lineTo(0, -6)
          ctx.lineTo(0, 6)
          ctx.closePath()
          ctx.fill()

          ctx.restore()
        }
      })
    }
  }, [blueprint, selectedAreaId, hoveredArea, showCCTV, navigationRoute, showFullMap, canvasSize])

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onAreaSelect) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * blueprint.width
    const y = ((event.clientY - rect.top) / rect.height) * blueprint.height

    // Check which area was clicked
    for (const area of blueprint.areas) {
      if (isPointInPolygon({ x, y }, area.polygon)) {
        onAreaSelect(area.id)
        break
      }
    }
  }

  const handleCanvasHover = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * blueprint.width
    const y = ((event.clientY - rect.top) / rect.height) * blueprint.height

    // Check which area is hovered
    let foundArea: string | null = null
    for (const area of blueprint.areas) {
      if (isPointInPolygon({ x, y }, area.polygon)) {
        foundArea = area.id
        break
      }
    }

    setHoveredArea(foundArea)
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasHover}
        onMouseLeave={() => setHoveredArea(null)}
        style={{
          width: '100%',
          height: 'auto',
          cursor: onAreaSelect ? 'pointer' : 'default',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}
      />

      {showCCTV && (
        <div
          style={{
            position: 'absolute',
            top: 'var(--space-md)',
            right: 'var(--space-md)',
            padding: '8px 12px',
            background: 'rgba(11, 19, 36, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            color: 'var(--accent-blue)'
          }}
        >
          <Camera size={14} />
          <Zap size={12} className="animate-glow" />
          <span>ML Processing Active</span>
        </div>
      )}
    </div>
  )
}

// Helper function to check if point is inside polygon
function isPointInPolygon(point: { x: number; y: number }, polygon: { x: number; y: number }[]): boolean {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x
    const yi = polygon[i].y
    const xj = polygon[j].x
    const yj = polygon[j].y

    const intersect = yi > point.y !== yj > point.y && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }
  return inside
}
