import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    const { error: authError } = await supabase.auth.signUp({ email: email.trim(), password })
    setLoading(false)
    if (authError) {
      setError('Could not create account. Please try a different email.')
      return
    }
    navigate('/dashboard')
  }

  return (
    <div className="flex items-center justify-center px-4 py-16 md:py-24">
      <div className="w-full max-w-md">
        <h1 className="font-serif text-3xl font-800 text-center mb-2">Create your account</h1>
        <p className="text-ink/60 text-center mb-8">Start hosting events in under a minute.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm mb-1 font-mono">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={254}
              required
              className="w-full min-h-[44px] px-4 py-3 border border-ink/20 rounded-lg bg-white font-mono focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm mb-1 font-mono">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={128}
              required
              className="w-full min-h-[44px] px-4 py-3 border border-ink/20 rounded-lg bg-white font-mono focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="At least 8 characters"
            />
          </div>
          {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[44px] px-6 py-3 bg-primary text-white rounded-lg font-mono hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition-opacity"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="text-center text-sm text-ink/60 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-dark underline focus:outline-none focus:ring-2 focus:ring-primary">Sign in</Link>
        </p>
      </div>
    </div>
  )
}