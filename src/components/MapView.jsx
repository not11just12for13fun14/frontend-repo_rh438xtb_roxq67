import { useEffect, useRef } from 'react'

// Simple Leaflet-less map using MapLibre GL JS would require extra deps.
// To avoid adding packages, we'll use a minimal Google Maps iframe.
// It won't let us add markers dynamically without an API key, so instead
// we render a custom canvas overlay with markers. Simpler approach:
// Use maptiler tiles in an <iframe> is not feasible. As a pragmatic choice,
// display a responsive map container and render markers absolutely based on
// projected coordinates using a Web Mercator helper for a static base map image.

const WORLD_MAP_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

// Helper to convert lon/lat to pixel in Web Mercator at given zoom and tile size
function lonLatToPixel(lon, lat, zoom, tileSize = 256) {
  const siny = Math.min(Math.max(Math.sin((lat * Math.PI) / 180), -0.9999), 0.9999)
  const scale = (1 << zoom) * tileSize
  const x = tileSize * (0.5 + lon / 360)
  const y = tileSize * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
  return { x: x * (1 << zoom), y: y * (1 << zoom), scale }
}

function MapView({ events }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    draw()
  }, [events])

  const draw = () => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const width = container.clientWidth
    const height = container.clientHeight
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, width, height)

    // Simple viewport over the world using fixed zoom and center
    const zoom = 1 // world view
    const center = { lon: 0, lat: 20 }
    const centerPx = lonLatToPixel(center.lon, center.lat, zoom)

    // Project and draw markers
    events.forEach((ev) => {
      const p = lonLatToPixel(ev.longitude, ev.latitude, zoom)
      const x = width / 2 + (p.x - centerPx.x) / 500 // scale factor fit
      const y = height / 2 + (p.y - centerPx.y) / 500
      // marker
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, Math.PI * 2)
      ctx.fillStyle = '#10b981'
      ctx.fill()
      ctx.strokeStyle = '#064e3b'
      ctx.lineWidth = 2
      ctx.stroke()
    })
  }

  return (
    <div ref={containerRef} className="relative w-full h-[520px] rounded-2xl overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08),transparent_60%)] border border-emerald-900/30">
      {/* Placeholder grid to suggest map background */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent,transparent),linear-gradient(#0f172a_1px,transparent_1px),linear-gradient(90deg,#0f172a_1px,transparent_1px)] bg-[length:100%_100%,24px_24px,24px_24px]" />
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Legend */}
      <div className="absolute top-3 left-3 bg-slate-900/80 text-white text-xs px-3 py-1.5 rounded-full border border-emerald-500/30 shadow">
        {events.length} events
      </div>
    </div>
  )
}

export default MapView
