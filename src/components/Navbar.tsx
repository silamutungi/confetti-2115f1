import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-ink text-paper">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="font-serif text-xl font-600 focus:outline-none focus:ring-2 focus:ring-primary rounded">Confetti</Link>
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard" className="min-h-[44px] flex items-center px-3 py-2 text-sm text-paper/70 hover:text-paper focus:outline-none focus:ring-2 focus:ring-primary rounded">Dashboard</Link>
              <span className="text-sm text-paper/50 truncate max-w-[180px]">{user.email}</span>
              <button onClick={handleLogout} className="min-h-[44px] px-4 py-2 border border-paper/20 rounded-lg text-sm hover:bg-paper/10 focus:outline-none focus:ring-2 focus:ring-primary transition-colors">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="min-h-[44px] flex items-center px-4 py-2 text-sm text-paper/70 hover:text-paper focus:outline-none focus:ring-2 focus:ring-primary rounded">Sign in</Link>
              <Link to="/signup" className="min-h-[44px] flex items-center px-4 py-2 bg-primary text-white rounded-lg text-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary transition-opacity">Get started</Link>
            </>
          )}
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary rounded" aria-label="Toggle menu" aria-expanded={menuOpen}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-paper/10 px-4 py-4 space-y-2">
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block min-h-[44px] py-3 text-paper/70 hover:text-paper">Dashboard</Link>
              <span className="block text-sm text-paper/50 truncate">{user.email}</span>
              <button onClick={handleLogout} className="block min-h-[44px] py-3 text-paper/70 hover:text-paper">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block min-h-[44px] py-3 text-paper/70 hover:text-paper">Sign in</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="block min-h-[44px] py-3 text-primary">Get started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}