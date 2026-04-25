import { useState } from 'react'
import carsData from '../data/cars.json'
import SearchBar from './SearchBar'
import CategoryFilter from './CategoryFilter'
import CarCard from './CarCard'
import BottomNav from './BottomNav'
import FilterPanel from './FilterPanel'

const CATEGORIES = ['All', 'Sports', 'Luxury', 'Electric', 'SUV', 'Sedan', 'Coupe']
const DEFAULT_FILTERS = { sortBy: 'rating', minRating: 0 }

export default function SearchPage({ onSelectCar }) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [showFilter, setShowFilter] = useState(false)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const filtersActive =
    filters.sortBy !== DEFAULT_FILTERS.sortBy ||
    filters.minRating !== DEFAULT_FILTERS.minRating

  const filtered = carsData
    .filter(car => {
      const matchesQuery =
        query === '' ||
        car.name.toLowerCase().includes(query.toLowerCase()) ||
        car.brand.toLowerCase().includes(query.toLowerCase())

      const matchesCategory =
        activeCategory === 'All' || car.categories.includes(activeCategory)

      const matchesRating = car.rating >= filters.minRating

      return matchesQuery && matchesCategory && matchesRating
    })
    .sort((a, b) => {
      if (filters.sortBy === 'reviews') return b.reviewCount - a.reviewCount
      if (filters.sortBy === 'trending') return a.trending - b.trending
      return b.rating - a.rating
    })

  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="px-4 pt-12 pb-3">
          <SearchBar
            value={query}
            onChange={setQuery}
            onFilterClick={() => setShowFilter(true)}
            filtersActive={filtersActive}
          />
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
              No cars match your filters.
            </div>
          )}
        </div>
      </div>

      <BottomNav active="search" />

      {showFilter && (
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onClose={() => setShowFilter(false)}
        />
      )}
    </div>
  )
}
