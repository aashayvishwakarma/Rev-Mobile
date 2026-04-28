export default function CategoryFilter({ categories, active, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            active === cat
              ? 'bg-[#c9a96e] text-black'
              : 'bg-transparent border border-[#333] text-white'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
