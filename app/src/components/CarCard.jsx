export default function CarCard({ car, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 bg-[#1a1a1a] rounded-2xl p-3 text-left hover:bg-[#222] transition-colors"
    >
      <img
        src={car.image}
        alt={car.name}
        className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-[#2a2a2a]"
        onError={e => {
          e.target.onerror = null
          e.target.src = `https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=200&q=80&fit=crop&auto=format`
        }}
      />
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-semibold text-base leading-tight">{car.name}</h3>
        <p className="text-[#666] text-sm mt-0.5 mb-2">{car.year}</p>
        <div className="flex gap-1.5 flex-wrap">
          {car.categories.map(cat => (
            <span
              key={cat}
              className="text-xs text-white border border-[#333] px-2 py-0.5 rounded-full"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-end flex-shrink-0 ml-2">
        <div className="flex items-baseline gap-0.5">
          <span className="text-[#c9a96e] font-bold text-xl">{car.rating}</span>
          <span className="text-[#555] text-xs">/10</span>
        </div>
        <span className="text-[#555] text-xs mt-0.5">{car.reviewCount} reviews</span>
      </div>
    </button>
  )
}
