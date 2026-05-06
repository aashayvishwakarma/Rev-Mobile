import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import SearchBar from './SearchBar'
import CategoryFilter from './CategoryFilter'
import CarCard from './CarCard'
import BottomNav from './BottomNav'
import FilterPanel from './FilterPanel'

const CATEGORIES = ['All', 'Sports', 'Luxury', 'Electric', 'SUV', 'Sedan', 'Coupe']
const DEFAULT_FILTERS = { sortBy: 'rating', minRating: 0 }

function mapCar(row) {
  return {
    id: row.id,
    name: `${row.make} ${row.model}`,
    brand: row.make,
    year: row.year,
    rating: row.avg_rating,
    reviewCount: row.review_count,
    wouldBuy: row.would_buy_pct,
    trending: row.trending_rank,
    categories: row.categories || [],
    image: row.image_url,
    ratingBreakdown: row.rating_breakdown || {},
    mostLovedFeatures: row.most_loved || [],
    leastLovedFeatures: row.least_loved || [],
    recentReviews: row.recent_reviews || [],
  }
}

export default function SearchPage({ onSelectCar, onTabChange }) {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [showFilter, setShowFilter] = useState(false)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  useEffect(() => {
    async function fetchCars() {
      const { data, error } = await supabase.from('cars').select('*')
      if (!error && data) setCars(data.map(mapCar))
      setLoading(false)
    }
    fetchCars()
  }, [])

  const filtersActive =
    filters.sortBy !== DEFAULT_FILTERS.sortBy ||
    filters.minRating !== DEFAULT_FILTERS.minRating

  const filtered = cars
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
          {loading ? (
            <div className="text-center text-[#555] py-16 text-sm">Loading cars...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-[#555] py-16 text-sm">No cars match your filters.</div>
          ) : (
            filtered.map(car => (
              <CarCard key={car.id} car={car} onClick={() => onSelectCar(car)} />
            ))
          )}
        </div>
      </div>

      <BottomNav active="search" onChange={onTabChange} />

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
