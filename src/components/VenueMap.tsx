import { AlertTriangle, Camera, Zap } from 'lucide-react'
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
  externalPin?: {
    point: { x: number; y: number }
    label?: string
    source?: string
  }
}

const getAreaColor = (area: VenueArea, opacity = 0.3) => {
  if (area.type === 'field') {
    return `rgba(22, 163, 74, ${Math.max(0.22, opacity * 0.9)})`
  }

  switch (area.level) {
    case 'low':
      return `rgba(52, 211, 153, ${opacity})`
    case 'medium':
      return `rgba(251, 191, 36, ${opacity})`
    case 'high':
      return `rgba(248, 113, 113, ${opacity})`
    case 'critical':
      return `rgba(220, 38, 38, ${opacity})`
  }
}

const getAreaStrokeColor = (area: VenueArea) => {
  if (area.type === 'field') {
    return '#16a34a'
  }

  switch (area.level) {
    case 'low':
      return '#34d399'
    case 'medium':
      return '#fbbf24'
    case 'high':
      return '#f87171'
    case 'critical':
      return '#dc2626'
  }
}

type LabelBox = {
  left: number
  top: number
  right: number
  bottom: number
}

const isOverlapping = (a: LabelBox, b: LabelBox) => {
  return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom)
}

const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + width - r, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + r)
  ctx.lineTo(x + width, y + height - r)
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  ctx.lineTo(x + r, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

const drawStadiumBackdrop = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const centerX = width / 2
  const centerY = height / 2
  const outerX = width * 0.43
  const outerY = height * 0.37
  const innerX = width * 0.34
  const innerY = height * 0.28

  const bowlGradient = ctx.createRadialGradient(centerX, centerY, width * 0.08, centerX, centerY, width * 0.55)
  bowlGradient.addColorStop(0, 'rgba(126, 68, 35, 0.55)')
  bowlGradient.addColorStop(1, 'rgba(69, 42, 25, 0.1)')

  ctx.save()
  ctx.fillStyle = bowlGradient
  ctx.beginPath()
  ctx.ellipse(centerX, centerY, outerX, outerY, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = 'rgba(249, 115, 22, 0.24)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.ellipse(centerX, centerY, outerX, outerY, 0, 0, Math.PI * 2)
  ctx.stroke()

  ctx.fillStyle = 'rgba(45, 28, 17, 0.64)'
  ctx.beginPath()
  ctx.ellipse(centerX, centerY, innerX, innerY, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = 'rgba(22, 163, 74, 0.18)'
  ctx.beginPath()
  ctx.ellipse(centerX, centerY, width * 0.2, height * 0.15, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = 'rgba(134, 239, 172, 0.45)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.ellipse(centerX, centerY, width * 0.2, height * 0.15, 0, 0, Math.PI * 2)
  ctx.stroke()

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(centerX - width * 0.2, centerY)
  ctx.lineTo(centerX + width * 0.2, centerY)
  ctx.stroke()
  ctx.restore()
}

const compactAreaLabel = (name: string) => {
  const parts = name.split(' ')
  if (parts.length <= 2) return name
  if (parts[0].toLowerCase() === 'parking' && parts[1]?.toLowerCase() === 'lot') return `Lot ${parts[2] ?? ''}`.trim()
  if (parts[1]?.toLowerCase() === 'stand') return `${parts[0]} Stand`
  if (parts[0].toLowerCase() === 'food' && parts[1]?.toLowerCase() === 'court') return `Food ${parts[2] ?? ''}`.trim()
  if (parts[0].toLowerCase() === 'emergency' && parts[1]?.toLowerCase() === 'exit') return `Exit ${parts[2] ?? ''}`.trim()
  return `${parts[0]} ${parts[1]}`
}

export const VenueMap = ({
  blueprint,
  selectedAreaId,
  onAreaSelect,
  showCCTV = false,
  navigationRoute,
  showFullMap = true,
  externalPin
}: VenueMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredArea, setHoveredArea] = useState<string | null>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 800 })
  const isCompactCanvas = canvasSize.width < 640
  const labelFontSize = canvasSize.width < 520 ? 9 : 11
  const metricFontSize = canvasSize.width < 520 ? 8 : 10

  useEffect(() => {
    const updateSize = () => {
      const container = canvasRef.current?.parentElement
      if (container) {
        const sidePadding = container.clientWidth < 560 ? 8 : 32
        const width = Math.max(280, Math.min(container.clientWidth - sidePadding, 800))
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
    ctx.fillStyle = 'rgba(45, 30, 20, 0.5)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    drawStadiumBackdrop(ctx, canvas.width, canvas.height)

    // Filter areas if not showing full map
    const areasToShow = showFullMap
      ? blueprint.areas
      : selectedAreaId
      ? blueprint.areas.filter((a) => a.id === selectedAreaId || a.connectedTo.includes(selectedAreaId))
      : blueprint.areas

    const placedLabels: LabelBox[] = []

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

      const baseOpacity = area.type === 'field' ? 0.42 : area.type === 'concourse' ? 0.24 : area.type === 'seating' ? 0.2 : 0.28

      // Fill
      ctx.fillStyle = getAreaColor(area, isSelected ? baseOpacity + 0.18 : isHovered ? baseOpacity + 0.08 : baseOpacity)
      ctx.fill()

      // Stroke
      ctx.strokeStyle = getAreaStrokeColor(area)
      ctx.lineWidth = isSelected ? 3 : isHovered ? 2 : 1
      ctx.stroke()

      // Draw area label
      const centerX = area.polygon.reduce((sum, p) => sum + p.x, 0) / area.polygon.length * scaleX
      const centerY = area.polygon.reduce((sum, p) => sum + p.y, 0) / area.polygon.length * scaleY
      const occupancyPercent = Math.round((area.currentOccupancy / area.capacity) * 100)

      const scaledPoints = area.polygon.map((point) => ({ x: point.x * scaleX, y: point.y * scaleY }))
      const polygonWidth = Math.max(...scaledPoints.map((point) => point.x)) - Math.min(...scaledPoints.map((point) => point.x))
      const polygonHeight = Math.max(...scaledPoints.map((point) => point.y)) - Math.min(...scaledPoints.map((point) => point.y))

      const compactLabel = isCompactCanvas || polygonWidth < 130 || polygonHeight < 68
      const areaName = compactLabel ? compactAreaLabel(area.name) : area.name
      const occupancyText = area.type === 'field'
        ? 'Restricted area'
        : compactLabel
          ? `${occupancyPercent}%`
          : `${occupancyPercent}% (${area.currentOccupancy}/${area.capacity})`

      ctx.font = `bold ${labelFontSize}px Inter`
      const areaNameWidth = ctx.measureText(areaName).width
      ctx.font = `${metricFontSize}px Inter`
      const occupancyWidth = ctx.measureText(occupancyText).width

      const labelWidth = Math.max(areaNameWidth, occupancyWidth) + 14
      const labelHeight = compactLabel ? 24 : 30
      const labelBox: LabelBox = {
        left: centerX - labelWidth / 2,
        top: centerY - labelHeight / 2,
        right: centerX + labelWidth / 2,
        bottom: centerY + labelHeight / 2
      }

      const hiddenByCollision = placedLabels.some((existingLabel) => isOverlapping(existingLabel, labelBox))
      if (hiddenByCollision && !isSelected && !isHovered) {
        return
      }

      placedLabels.push(labelBox)

      drawRoundedRect(ctx, labelBox.left, labelBox.top, labelWidth, labelHeight, 6)
      ctx.fillStyle = 'rgba(38, 24, 15, 0.62)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.24)'
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.fillStyle = '#fff7ed'
      ctx.font = `bold ${labelFontSize}px Inter`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(areaName, centerX, centerY - (compactLabel ? 4 : 6))

      ctx.font = `${metricFontSize}px Inter`
      ctx.fillStyle = area.type === 'field'
        ? '#86efac'
        : occupancyPercent >= 80
          ? '#f87171'
          : occupancyPercent >= 60
            ? '#fbbf24'
            : '#d6c2a3'
      ctx.fillText(occupancyText, centerX, centerY + (compactLabel ? 6 : 8))
    })

    // Draw CCTV cameras
    if (showCCTV) {
      blueprint.cctvFeeds.forEach((feed) => {
        if (!showFullMap && selectedAreaId && feed.areaId !== selectedAreaId) return

        const x = feed.position.x * scaleX
        const y = feed.position.y * scaleY

        // Camera icon background
        ctx.fillStyle = feed.status === 'active' ? 'rgba(249, 115, 22, 0.82)' : 'rgba(148, 163, 184, 0.5)'
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.fill()

        // Camera pulse effect for active cameras
        if (feed.status === 'active') {
          ctx.strokeStyle = 'rgba(249, 115, 22, 0.45)'
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
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.82)'
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
          : 'rgba(249, 115, 22, 0.82)'
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

          ctx.fillStyle = 'rgba(249, 115, 22, 0.9)'
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

    if (externalPin) {
      const x = externalPin.point.x * scaleX
      const y = externalPin.point.y * scaleY

      ctx.save()
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(x, y, 18, 0, Math.PI * 2)
      ctx.stroke()

      ctx.fillStyle = 'rgba(14, 116, 144, 0.95)'
      ctx.beginPath()
      ctx.arc(x, y - 8, 9, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(x, y + 10)
      ctx.lineTo(x - 7, y - 2)
      ctx.lineTo(x + 7, y - 2)
      ctx.closePath()
      ctx.fill()

      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(x, y - 8, 3, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    }
  }, [blueprint, selectedAreaId, hoveredArea, showCCTV, navigationRoute, showFullMap, canvasSize, externalPin])

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
          display: 'block',
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
            background: 'rgba(43, 29, 19, 0.92)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(249, 115, 22, 0.3)',
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

      {blueprint.incident?.active && (
        <div
          style={{
            position: 'absolute',
            top: showCCTV ? 'calc(var(--space-md) + 44px)' : 'var(--space-md)',
            right: 'var(--space-md)',
            maxWidth: isCompactCanvas ? '60%' : '300px',
            padding: '8px 10px',
            background: 'rgba(239, 68, 68, 0.14)',
            border: '1px solid rgba(239, 68, 68, 0.45)',
            borderRadius: 'var(--radius-md)',
            color: '#fecaca',
            fontSize: '0.72rem',
            lineHeight: 1.35,
            display: 'flex',
            gap: '6px',
            alignItems: 'flex-start'
          }}
        >
          <AlertTriangle size={14} />
          <span>{blueprint.incident.guidance}</span>
        </div>
      )}

      {externalPin ? (
        <div
          style={{
            position: 'absolute',
            bottom: 'var(--space-md)',
            left: 'var(--space-md)',
            maxWidth: isCompactCanvas ? '72%' : '340px',
            padding: '8px 10px',
            background: 'rgba(8, 47, 73, 0.78)',
            border: '1px solid rgba(56, 189, 248, 0.42)',
            borderRadius: 'var(--radius-md)',
            color: '#e0f2fe',
            fontSize: '0.72rem',
            lineHeight: 1.35
          }}
        >
          <strong style={{ display: 'block' }}>Pinned Location</strong>
          <span>{externalPin.label ?? 'Google Maps lookup result'}</span>
          {externalPin.source ? <span style={{ display: 'block', opacity: 0.85 }}>Source: {externalPin.source}</span> : null}
        </div>
      ) : null}
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
