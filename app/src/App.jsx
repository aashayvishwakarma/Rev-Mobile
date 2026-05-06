import { useState } from 'react'
import SearchPage from './components/SearchPage'
import CarDetailPage from './components/CarDetailPage'
import ProfilePage from './components/ProfilePage'

export default function App() {
  const [tab, setTab] = useState('search')
  const [selectedCar, setSelectedCar] = useState(null)

  const renderTab = () => {
    if (selectedCar) {
      return <CarDetailPage car={selectedCar} onBack={() => setSelectedCar(null)} />
    }
    if (tab === 'profile') {
      return <ProfilePage onTabChange={setTab} />
    }
    return <SearchPage onSelectCar={setSelectedCar} onTabChange={setTab} />
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex justify-center">
      <div className="w-full max-w-[390px] min-h-screen relative bg-black shadow-2xl">
        {renderTab()}
      </div>
    </div>
  )
}
