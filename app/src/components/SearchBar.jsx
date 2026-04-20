import { Search, SlidersHorizontal } from 'lucide-react'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 flex items-center gap-2 bg-[#1a1a1a] rounded-full px-4 py-3">
        <Search size={18} className="text-[#666] flex-shrink-0" />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Search cars..."
          className="flex-1 bg-transparent text-white placeholder-[#666] outline-none text-sm"
        />
      </div>
      <button className="w-11 h-11 flex items-center justify-center bg-[#1a1a1a] rounded-full flex-shrink-0">
        <SlidersHorizontal size={18} className="text-[#888]" />
      </button>
    </div>
  )
}
