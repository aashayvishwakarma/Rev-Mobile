import { useState } from 'react'
import carsData from '../data/cars.json'
import SearchBar from './SearchBar'
import CategoryFilter from './CategoryFilter'
import CarCard from './CarCard'
import BottomNav from './BottomNav'

const CATEGORIES = ['All', 'Sports', 'Luxury', 'Electric', 'SUV', 'Sedan', 'Coupe']

export default function SearchPage({ onSelectCar }) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = carsData.filter(car => {
    const matchesQuery =
      query === '' ||
      car.name.toLowerCase().includes(query.toLowerCase()) ||
      car.brand.toLowerCase().includes(query.toLowerCase())

    const matchesCategory =
      activeCategory === 'All' || car.categories.includes(activeCategory)

    return matchesQuery && matchesCategory
  })

  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="px-4 pt-12 pb-3">
          <SearchBar value={query} onChange={setQuery} />
        </div>
        <div className="px-4 pb-4">
          <CategoryFilter
            categories={CATEGORIES}
            active={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>
        <div className="px-4 flex flex-col gap-3">
          {filtered.map(car => (
            <CarCard key={car.id} car={car} onClick={() => onSelectCar(car)} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-[#555] py-16 text-sm">
              No cars found{query ? ` for "${query}"` : ''}.
            </div>
          )}
        </div>
      </div>
      <BottomNav active="search" />
    </div>
  )
}
