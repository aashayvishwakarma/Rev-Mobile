import { useState } from 'react'
import SearchPage from './components/SearchPage'
import CarDetailPage from './components/CarDetailPage'

export default function App() {
  const [selectedCar, setSelectedCar] = useState(null)

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex justify-center">
      <div className="w-full max-w-[390px] min-h-screen relative bg-black shadow-2xl">
        {selectedCar ? (
          <CarDetailPage car={selectedCar} onBack={() => setSelectedCar(null)} />
        ) : (
          <SearchPage onSelectCar={setSelectedCar} />
        )}
      </div>
    </div>
  )
}
