import { X } from 'lucide-react'

const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'reviews', label: 'Most Reviews' },
  { value: 'trending', label: 'Trending' },
]

const MIN_RATINGS = [
  { value: 0, label: 'Any' },
  { value: 8.0, label: '8.0+' },
  { value: 8.5, label: '8.5+' },
  { value: 9.0, label: '9.0+' },
]

export default function FilterPanel({ filters, onChange, onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-20"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-[#111] rounded-t-3xl z-30 p-6 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-lg">Filter & Sort</h2>
          <button onClick={onClose} className="text-[#666]">
            <X size={20} />
          </button>
        </div>

        {/* Sort */}
        <p className="text-[#666] text-xs uppercase tracking-wider mb-3">Sort By</p>
        <div className="flex gap-2 mb-6 flex-wrap">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...filters, sortBy: opt.value })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filters.sortBy === opt.value
                  ? 'bg-[#c9a96e] text-black'
                  : 'border border-[#333] text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Min Rating */}
        <p className="text-[#666] text-xs uppercase tracking-wider mb-3">Minimum Rating</p>
        <div className="flex gap-2 mb-8">
          {MIN_RATINGS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...filters, minRating: opt.value })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filters.minRating === opt.value
                  ? 'bg-[#c9a96e] text-black'
                  : 'border border-[#333] text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Apply */}
        <button
          onClick={onClose}
          className="w-full bg-[#c9a96e] text-black font-semibold py-4 rounded-full text-sm"
        >
          Apply Filters
        </button>
      </div>
    </>
  )
}
