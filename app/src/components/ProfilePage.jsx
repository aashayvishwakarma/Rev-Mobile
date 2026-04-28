import { useState, useMemo } from 'react'
import { Settings, Trophy, Zap, Grid3x3, Plus } from 'lucide-react'
import profileData from '../data/profile.json'
import carsData from '../data/cars.json'
import BottomNav from './BottomNav'

const BADGE_ICONS = { trophy: Trophy, zap: Zap }

function formatStat(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return n.toString()
}

function GarageCard({ car, rating, year, index }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-[#1a1a1a] aspect-square group cursor-pointer animate-fade-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <img
        src={car.image}
        alt={car.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={e => {
          e.target.onerror = null
          e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80&fit=crop&auto=format'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-bold text-[#c9a96e] border border-white/10">
        {rating}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-white font-semibold text-sm leading-tight">{car.name}</h3>
        <p className="text-[#999] text-xs mt-0.5">{year}</p>
      </div>
    </div>
  )
}

function AddCarTile() {
  return (
    <button
      className="rounded-2xl border-2 border-dashed border-[#333] aspect-square flex flex-col items-center justify-center gap-2 text-[#555] hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors duration-300 animate-fade-up"
      style={{ animationDelay: '240ms' }}
    >
      <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center transition-transform duration-300 group-hover:rotate-90">
        <Plus size={24} />
      </div>
      <span className="text-sm">Add Car</span>
    </button>
  )
}

export default function ProfilePage({ onTabChange }) {
  const [tab, setTab] = useState('garage')

  const garageCars = useMemo(
    () =>
      profileData.garage
        .map(g => {
          const car = carsData.find(c => c.id === g.carId)
          return car ? { ...car, ownerRating: g.ownerRating, ownedSince: g.ownedSince } : null
        })
        .filter(Boolean),
    []
  )

  const drivenCars = useMemo(
    () =>
      profileData.driven
        .map(d => {
          const car = carsData.find(c => c.id === d.carId)
          return car ? { ...car, drivenRating: d.drivenRating, drivenOn: d.drivenOn } : null
        })
        .filter(Boolean),
    []
  )

  const visibleCars = tab === 'garage' ? garageCars : drivenCars
  const countLabel =
    tab === 'garage'
      ? `${garageCars.length} ${garageCars.length === 1 ? 'car' : 'cars'} owned`
      : `${drivenCars.length} ${drivenCars.length === 1 ? 'car' : 'cars'} driven`

  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Header */}
        <div className="px-5 pt-12 pb-5 animate-fade-down">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-white text-2xl font-bold">Profile</h1>
            <button className="text-[#888] hover:text-white transition-colors hover:rotate-45 duration-300">
              <Settings size={22} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#d4b87a] to-[#a88a4f] flex items-center justify-center text-black font-bold text-2xl shadow-lg shadow-[#c9a96e]/20 transition-transform duration-300 hover:scale-105">
              {profileData.initials}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-white text-xl font-bold leading-tight">{profileData.name}</h2>
              <p className="text-[#888] text-sm mt-1">{profileData.bio}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {profileData.badges.map((b, i) => {
                  const Icon = BADGE_ICONS[b.icon] || Trophy
                  return (
                    <span
                      key={b.label}
                      className="inline-flex items-center gap-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-2.5 py-1 text-xs text-white animate-fade-in"
                      style={{ animationDelay: `${150 + i * 100}ms` }}
                    >
                      <Icon size={12} className="text-[#c9a96e]" />
                      {b.label}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 mt-6 gap-2">
            {[
              { label: 'Reviews', value: formatStat(profileData.stats.reviews) },
              { label: 'Followers', value: formatStat(profileData.stats.followers) },
              { label: 'Following', value: formatStat(profileData.stats.following) },
            ].map((s, i) => (
              <div
                key={s.label}
                className="text-center animate-fade-up"
                style={{ animationDelay: `${200 + i * 80}ms` }}
              >
                <div className="text-white text-2xl font-bold">{s.value}</div>
                <div className="text-[#888] text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#1a1a1a]" />

        {/* Tabs */}
        <div className="px-5 pt-4">
          <div className="relative bg-[#1a1a1a] rounded-full p-1 flex">
            <div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#2a2a2a] rounded-full transition-transform duration-300 ease-out"
              style={{ transform: tab === 'garage' ? 'translateX(0)' : 'translateX(100%)' }}
            />
            {['garage', 'driven'].map(id => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`relative flex-1 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
                  tab === id ? 'text-white' : 'text-[#777]'
                }`}
              >
                {id === 'garage' ? 'My Garage' : 'Driven'}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 mb-3">
            <span className="text-[#888] text-sm">{countLabel}</span>
            <button className="flex items-center gap-1.5 text-white text-sm font-medium hover:text-[#c9a96e] transition-colors">
              Manage
              <Grid3x3 size={16} />
            </button>
          </div>
        </div>

        {/* Car grid */}
        <div key={tab} className="px-5 grid grid-cols-2 gap-3 animate-fade-in-fast">
          {visibleCars.map((car, i) => (
            <GarageCard
              key={car.id}
              car={car}
              rating={tab === 'garage' ? car.ownerRating : car.drivenRating}
              year={tab === 'garage' ? car.ownedSince : new Date(car.drivenOn).getFullYear()}
              index={i}
            />
          ))}
          {tab === 'garage' && <AddCarTile />}
          {visibleCars.length === 0 && tab === 'driven' && (
            <div className="col-span-2 text-center text-[#555] py-12 text-sm">
              No driven cars logged yet.
            </div>
          )}
        </div>
      </div>

      <BottomNav active="profile" onChange={onTabChange} />
    </div>
  )
}
