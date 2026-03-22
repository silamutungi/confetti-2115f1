import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Event, Rsvp } from '../types'

const EMOJIS = ['🎉', '🎂', '🍕', '🎸', '🏖️', '🎃', '🥂', '🏀']

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [rsvps, setRsvps] = useState<Record<string, Rsvp[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', description: '', location: '', event_date: '', event_time: '', cover_emoji: '🎉' })
  const [saving, setSaving] = useState(false)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not authenticated.'); setLoading(false); return }
    const { data, error: fetchErr } = await supabase.from('events').select('*').eq('user_id', user.id).is('deleted_at', null).order('event_date', { ascending: true })
    if (fetchErr) { setError('Could not load events. Please refresh.'); setLoading(false); return }
    setEvents(data || [])
    const rsvpMap: Record<string, Rsvp[]> = {}
    for (const ev of data || []) {
      const { data: rsvpData } = await supabase.from('rsvps').select('*').eq('event_id', ev.id).is('deleted_at', null)
      rsvpMap[ev.id] = rsvpData || []
    }
    setRsvps(rsvpMap)
    setLoading(false)
  }, [])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.event_date) { setError('Title and date are required.'); return }
    setSaving(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not authenticated.'); setSaving(false); return }
    const { error: insertErr } = await supabase.from('events').insert({ user_id: user.id, title: form.title.trim().slice(0, 100), description: form.description.trim().slice(0, 500), location: form.location.trim().slice(0, 200), event_date: form.event_date, event_time: form.event_time || '19:00', cover_emoji: form.cover_emoji })
    setSaving(false)
    if (insertErr) { setError('Could not create event. Please try again.'); return }
    setForm({ title: '', description: '', location: '', event_date: '', event_time: '', cover_emoji: '🎉' })
    setShowForm(false)
    fetchEvents()
  }

  const copyLink = (eventId: string) => {
    const url = `${window.location.origin}/rsvp/${eventId}`
    navigator.clipboard.writeText(url)
  }

  const countByStatus = (eventId: string, status: string) => (rsvps[eventId] || []).filter(r => r.status === status).length

  if (loading) return <div className="flex justify-center py-32"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" role="status" aria-label="Loading"></div></div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-800">Your events</h1>
        <button onClick={() => setShowForm(!showForm)} className="min-h-[44px] px-6 py-3 bg-primary text-white rounded-lg font-mono hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary transition-opacity">
          {showForm ? 'Cancel' : 'New event'}
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">{error}</div>}

      {showForm && (
        <form onSubmit={handleCreate} className="mb-8 p-6 bg-white rounded-xl border border-ink/10 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm mb-1">Event name</label>
            <input id="title" type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} maxLength={100} required className="w-full min-h-[44px] px-4 py-3 border border-ink/20 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Birthday dinner" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm mb-1">Description</label>
            <textarea id="description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} maxLength={500} rows={3} className="w-full px-4 py-3 border border-ink/20 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary" placeholder="What's the occasion?" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm mb-1">Location</label>
              <input id="location" type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} maxLength={200} className="w-full min-h-[44px] px-4 py-3 border border-ink/20 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary" placeholder="My place" />
            </div>
            <div>
              <label htmlFor="event_date" className="block text-sm mb-1">Date</label>
              <input id="event_date" type="date" value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})} required className="w-full min-h-[44px] px-4 py-3 border border-ink/20 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="event_time" className="block text-sm mb-1">Time</label>
              <input id="event_time" type="time" value={form.event_time} onChange={e => setForm({...form, event_time: e.target.value})} className="w-full min-h-[44px] px-4 py-3 border border-ink/20 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm mb-1">Emoji</label>
              <div className="flex gap-2 flex-wrap">
                {EMOJIS.map(em => (
                  <button key={em} type="button" onClick={() => setForm({...form, cover_emoji: em})} className={`min-h-[44px] min-w-[44px] text-2xl rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-primary ${form.cover_emoji === em ? 'border-primary bg-primary/10' : 'border-ink/10'}`}>{em}</button>
                ))}
              </div>
            </div>
          </div>
          <button type="submit" disabled={saving} className="min-h-[44px] px-8 py-3 bg-primary text-white rounded-lg font-mono hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition-opacity">
            {saving ? 'Creating...' : 'Create event'}
          </button>
        </form>
      )}

      {events.length === 0 && !showForm && (
        <div className="text-center py-16 border-2 border-dashed border-ink/10 rounded-xl">
          <div className="text-5xl mb-4">🎈</div>
          <h2 className="font-serif text-xl font-600 mb-2">No events yet</h2>
          <p className="text-ink/60 mb-6">Create your first event and start collecting RSVPs.</p>
          <button onClick={() => setShowForm(true)} className="min-h-[44px] px-6 py-3 bg-primary text-white rounded-lg font-mono hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary transition-opacity">Create event</button>
        </div>
      )}

      <div className="space-y-4">
        {events.map(ev => (
          <div key={ev.id} className="bg-white rounded-xl border border-ink/10 overflow-hidden">
            <button onClick={() => setSelectedEvent(selectedEvent === ev.id ? null : ev.id)} className="w-full min-h-[44px] p-5 flex items-center gap-4 text-left hover:bg-ink/[0.02] focus:outline-none focus:ring-2 focus:ring-primary">
              <span className="text-4xl">{ev.cover_emoji}</span>
              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-xl font-600 truncate">{ev.title}</h2>
                <p className="text-sm text-ink/60">
                  {new Date(ev.event_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  {ev.location && ` · ${ev.location}`}
                </p>
              </div>
              <div className="flex gap-3 text-sm shrink-0">
                <span className="text-green-700">{countByStatus(ev.id, 'going')} going</span>
                <span className="text-amber-700">{countByStatus(ev.id, 'maybe')} maybe</span>
              </div>
            </button>
            {selectedEvent === ev.id && (
              <div className="border-t border-ink/10 p-5">
                {ev.description && <p className="text-ink/70 mb-4">{ev.description}</p>}
                <button onClick={() => copyLink(ev.id)} className="min-h-[44px] px-4 py-2 border-2 border-primary-dark text-primary-dark rounded-lg font-mono text-sm hover:bg-primary-dark/5 focus:outline-none focus:ring-2 focus:ring-primary transition-colors mb-4">
                  Copy invite link
                </button>
                {(rsvps[ev.id] || []).length === 0 ? (
                  <p className="text-ink/50 text-sm">No RSVPs yet. Share the invite link to get started.</p>
                ) : (
                  <div className="space-y-2">
                    {(rsvps[ev.id] || []).map(r => (
                      <div key={r.id} className="flex items-center justify-between py-2 border-b border-ink/5 last:border-0">
                        <div>
                          <span className="font-mono">{r.guest_name}</span>
                          <span className="text-ink/40 text-sm ml-2">{r.guest_email}</span>
                        </div>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          r.status === 'going' ? 'bg-green-100 text-green-800' :
                          r.status === 'maybe' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {r.status === 'cant_go' ? "Can't go" : r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}