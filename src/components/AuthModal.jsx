import { useState } from 'react'
import { X } from 'lucide-react'

export default function AuthModal({ onClose, signIn, signUp }) {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    if (mode === 'signin') {
      const { error } = await signIn(email, password)
      if (error) setError(error.message)
      else onClose()
    } else {
      const { error } = await signUp(email, password)
      if (error) setError(error.message)
      else setMessage('Check your email to confirm your account.')
    }

    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative bg-black border border-yellow-400 w-full max-w-sm mx-4">
        <div className="border-b border-yellow-400 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white uppercase tracking-widest" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-black border border-gray-700 text-white text-sm font-mono focus:outline-none focus:border-yellow-400 transition-colors"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-black border border-gray-700 text-white text-sm font-mono focus:outline-none focus:border-yellow-400 transition-colors"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            />
          </div>

          {error && <p className="text-red-400 text-xs font-mono" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{error}</p>}
          {message && <p className="text-green-400 text-xs font-mono" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-yellow-400 text-black font-mono font-bold uppercase tracking-wider hover:bg-yellow-300 disabled:bg-gray-800 disabled:text-gray-600 transition-colors"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            {loading ? 'LOADING...' : mode === 'signin' ? 'SIGN IN' : 'SIGN UP'}
          </button>

          <button
            type="button"
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setMessage(null) }}
            className="w-full text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-wider"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            {mode === 'signin' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
