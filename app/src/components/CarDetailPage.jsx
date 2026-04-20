import {
  ChevronLeft, Share2, Play, TrendingUp, TrendingDown,
  Star, MapPin, Zap, Target, Gem, Wrench, DollarSign, Smile,
} from 'lucide-react'

const ratingConfig = [
  { key: 'comfort',     label: 'Comfort',     Icon: Smile,         color: '#3B82F6' },
  { key: 'speed',       label: 'Speed',        Icon: Zap,           color: '#F59E0B' },
  { key: 'handling',    label: 'Handling',     Icon: Target,        color: '#EF4444' },
  { key: 'interior',    label: 'Interior',     Icon: Gem,           color: '#06B6D4' },
  { key: 'reliability', label: 'Reliability',  Icon: Wrench,        color: '#F97316' },
  { key: 'value',       label: 'Value',        Icon: DollarSign,    color: '#EAB308' },
]

export default function CarDetailPage({ car, onBack }) {
  return (
    <div className="flex flex-col h-screen bg-black overflow-y-auto">
      {/* Hero */}
      <div className="relative h-64 flex-shrink-0">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
        <button
          onClick={onBack}
          className="absolute top-12 left-4 w-9 h-9 bg-black/50 rounded-full flex items-center justify-center"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>
        <button className="absolute top-12 right-4 w-9 h-9 bg-black/50 rounded-full flex items-center justify-center">
          <Share2 size={17} className="text-white" />
        </button>
        {/* Name overlay on image */}
        <div className="absolute bottom-4 left-4">
          <h1 className="text-white text-2xl font-bold drop-shadow-lg">{car.name}</h1>
          <p className="text-white/60 text-sm">{car.year}</p>
        </div>
        {/* Rating overlay */}
        <div className="absolute bottom-4 right-4 flex flex-col items-end">
          <div className="flex items-baseline gap-0.5">
            <span className="text-[#c9a96e] text-3xl font-bold">{car.rating}</span>
            <span className="text-white/50 text-sm">/10</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={12} className="text-[#c9a96e] fill-[#c9a96e]" />
            <span className="text-white/50 text-xs">{car.reviewCount} reviews</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-4 pb-10">

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mt-4 mb-5">
          {[
            { value: car.reviewCount, label: 'Reviews' },
            { value: `${car.wouldBuy}%`, label: 'Would Buy' },
            { value: `#${car.trending}`, label: 'Trending' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-[#1a1a1a] rounded-xl p-3 text-center">
              <div className="text-white font-bold text-lg leading-tight">{value}</div>
              <div className="text-[#666] text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Visual Test Drive card */}
        <div className="bg-[#1a1a1a] rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#2a2a2a] rounded-xl flex items-center justify-center flex-shrink-0">
              <Play size={16} className="text-white fill-white ml-0.5" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Visual Test Drive</p>
              <p className="text-[#666] text-xs mt-0.5">
                Experience this car through an immersive visual journey
              </p>
            </div>
          </div>
          <button className="w-full bg-[#c9a96e] text-black font-semibold py-3 rounded-full flex items-center justify-center gap-2 text-sm">
            <Play size={13} className="fill-black" />
            Start Visual Test Drive
          </button>
        </div>

        {/* Rating Breakdown */}
        <div className="mb-6">
          <h2 className="text-white font-bold text-lg mb-3">Rating Breakdown</h2>
          <div className="flex flex-col gap-3">
            {ratingConfig.map(({ key, label, Icon, color }) => (
              <div key={key} className="bg-[#1a1a1a] rounded-xl px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon size={16} style={{ color }} />
                    <span className="text-white text-sm">{label}</span>
                  </div>
                  <span className="text-white font-semibold text-sm">
                    {car.ratingBreakdown[key]}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#c9a96e] rounded-full"
                    style={{ width: `${(car.ratingBreakdown[key] / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Loved Features */}
        <div className="mb-6">
          <h2 className="text-white font-bold text-lg mb-1">Most Loved Features</h2>
          <div>
            {car.mostLovedFeatures.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-[#1a1a1a]"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp size={15} className="text-[#c9a96e]" />
                  <span className="text-white text-sm">{f.feature}</span>
                </div>
                <span className="text-[#666] text-sm font-medium">{f.count}</span>
              </div>
            ))}
            {car.leastLovedFeatures.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-[#1a1a1a]"
              >
                <div className="flex items-center gap-3">
                  <TrendingDown size={15} className="text-[#ef4444]" />
                  <span className="text-white text-sm">{f.feature}</span>
                </div>
                <span className="text-[#666] text-sm font-medium">{f.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-bold text-lg">Recent Reviews</h2>
            <button className="text-[#c9a96e] text-sm">View All</button>
          </div>
          <div className="flex flex-col gap-3">
            {car.recentReviews.map((review, i) => (
              <div key={i} className="bg-[#1a1a1a] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-[#2a2a2a] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{review.initials}</span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{review.author}</p>
                      <p className="text-[#555] text-xs">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-white font-bold">{review.rating}</span>
                    <span className="text-[#555] text-xs">/10</span>
                  </div>
                </div>
                <p className="text-[#999] text-sm leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3">
          <button className="w-full bg-[#c9a96e] text-black font-semibold py-4 rounded-full text-sm">
            Rate This Car
          </button>
          <button className="w-full border border-[#2a2a2a] text-white font-medium py-4 rounded-full text-sm flex items-center justify-center gap-2">
            <MapPin size={15} />
            Find Dealerships &amp; Test Drives
          </button>
        </div>
      </div>
    </div>
  )
}
