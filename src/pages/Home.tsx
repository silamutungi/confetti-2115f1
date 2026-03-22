import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <section className="px-4 py-20 md:py-32 text-center max-w-3xl mx-auto">
        <h1 className="font-serif text-5xl md:text-7xl font-800 mb-6 leading-tight">
          Throw parties,<br />not spreadsheets.
        </h1>
        <p className="text-lg md:text-xl text-ink/60 mb-10 max-w-xl mx-auto">
          Beautiful event invitations your friends actually respond to. Create an event, share a link, and watch RSVPs roll in.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="min-h-[44px] px-8 py-3 bg-primary text-white rounded-lg font-mono text-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary transition-opacity"
          >
            Create your first event
          </Link>
          <Link
            to="/login"
            className="min-h-[44px] px-8 py-3 border-2 border-primary-dark text-primary-dark rounded-lg font-mono text-lg hover:bg-primary-dark/5 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          >
            Sign in
          </Link>
        </div>
      </section>

      <section className="px-4 py-16 bg-ink text-paper">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-600 text-center mb-12">
            How Confetti works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="font-serif text-xl font-600 mb-2">Create an event</h3>
              <p className="text-[#c8c4bc]">Add a title, date, location, and a fun emoji. Takes less than a minute.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🔗</div>
              <h3 className="font-serif text-xl font-600 mb-2">Share the link</h3>
              <p className="text-[#c8c4bc]">Send your invite link to friends. No app downloads, no account needed to RSVP.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="font-serif text-xl font-600 mb-2">Track RSVPs</h3>
              <p className="text-[#c8c4bc]">See who's going, who's a maybe, and who can't make it — all in real time.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 max-w-3xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-600 mb-6">No more group chat chaos</h2>
        <p className="text-ink/60 text-lg mb-8">
          Stop asking "wait, are you coming?" in every thread. Confetti gives you one clean page per event with a guest list you can actually rely on.
        </p>
        <Link
          to="/signup"
          className="inline-block min-h-[44px] px-8 py-3 bg-primary text-white rounded-lg font-mono text-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary transition-opacity"
        >
          Get started free
        </Link>
      </section>
    </div>
  )
}