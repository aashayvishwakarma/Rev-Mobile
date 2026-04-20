import { MessageSquare, Search, Plus, ShoppingBag, User } from 'lucide-react'

const navItems = [
  { id: 'feed', icon: MessageSquare, label: 'Feed' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'add', icon: Plus, label: '' },
  { id: 'market', icon: ShoppingBag, label: 'Market' },
  { id: 'profile', icon: User, label: 'Profile' },
]

export default function BottomNav({ active }) {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-black/95 border-t border-[#1a1a1a] px-6 py-3 flex items-center justify-between z-10 backdrop-blur-sm">
      {navItems.map(({ id, icon: Icon, label }) => {
        if (id === 'add') {
          return (
            <button
              key={id}
              className="w-12 h-12 bg-[#c9a96e] rounded-full flex items-center justify-center -mt-5 shadow-lg"
            >
              <Icon size={22} className="text-black" />
            </button>
          )
        }
        return (
          <button
            key={id}
            className={`flex flex-col items-center gap-0.5 min-w-[44px] ${
              active === id ? 'text-white' : 'text-[#555]'
            }`}
          >
            <Icon size={22} />
            <span className="text-[10px]">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
