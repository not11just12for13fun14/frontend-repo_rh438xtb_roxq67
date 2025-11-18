import { useState, useEffect } from 'react'

const EVENT_TYPES = [
  { key: 'worship', label: 'Worship' },
  { key: 'conference', label: 'Conference' },
  { key: 'retreat', label: 'Retreat' },
  { key: 'concert', label: 'Concert' },
  { key: 'service', label: 'Service' },
  { key: 'youth', label: 'Youth' },
  { key: 'prayer', label: 'Prayer' },
  { key: 'other', label: 'Other' },
]

function Filters({ onChange }) {
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [types, setTypes] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    onChange({ start, end, types, q: query })
  }, [start, end, types, query])

  const toggleType = (key) => {
    setTypes((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
    )
  }

  return (
    <div className="w-full bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 rounded-2xl shadow-xl p-4 sm:p-6 border border-slate-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Start date</label>
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">End date</label>
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="mt-1 w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700">Search</label>
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search titles, locations..." className="mt-1 w-full rounded-lg border-slate-300 focus:border-emerald-500 focus:ring-emerald-500" />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {EVENT_TYPES.map((t) => (
          <button key={t.key} onClick={() => toggleType(t.key)} className={`px-3 py-1.5 rounded-full text-sm border transition-all ${types.includes(t.key) ? 'bg-emerald-600 text-white border-emerald-700 shadow' : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'}`}>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Filters
