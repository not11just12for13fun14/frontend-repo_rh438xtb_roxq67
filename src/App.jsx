import { useEffect, useMemo, useState } from 'react'
import Hero from './components/Hero'
import Filters from './components/Filters'
import MapView from './components/MapView'

function App() {
  const [filters, setFilters] = useState({ start: '', end: '', types: [], q: '' })
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    if (filters.start) params.set('start', new Date(filters.start).toISOString())
    if (filters.end) params.set('end', new Date(filters.end).toISOString())
    if (filters.types?.length) params.set('types', filters.types.join(','))
    if (filters.q) params.set('q', filters.q)
    return params.toString()
  }, [filters])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}/api/events${queryString ? `?${queryString}` : ''}`)
      const data = await res.json()
      setEvents(data.items || [])
    } catch (e) {
      console.error(e)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Hero />

      <main className="relative -mt-16 z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Filters onChange={setFilters} />

          <div className="mt-6">
            {loading ? (
              <div className="h-[520px] rounded-2xl border border-slate-800 bg-slate-900/60 grid place-items-center">
                <p className="text-slate-300">Loading events...</p>
              </div>
            ) : (
              <MapView events={events} />
            )}
          </div>

          <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.slice(0, 6).map((ev) => (
              <div key={ev.id} className="rounded-xl bg-slate-900/60 border border-slate-800 p-4">
                <h3 className="text-lg font-semibold text-white">{ev.title}</h3>
                <p className="text-sm text-slate-300 line-clamp-2">{ev.description}</p>
                <div className="mt-3 text-xs text-slate-400 flex flex-wrap gap-3">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600/20 border border-emerald-700/40 text-emerald-300">{ev.type}</span>
                  {ev.city && <span>{ev.city}</span>}
                  {ev.country && <span>{ev.country}</span>}
                  {ev.start_date && <span>{new Date(ev.start_date).toLocaleDateString()}</span>}
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>

      <footer className="mt-16 py-8 text-center text-slate-500">
        Curated Christian events around the world
      </footer>
    </div>
  )
}

export default App
