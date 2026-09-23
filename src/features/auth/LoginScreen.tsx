import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { GameGateLogo } from '@/components/ui/GameGateLogo'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.16-3.16C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  )
}

export default function LoginScreen() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Ingresa tu correo y contraseña.')
      return
    }
    setError(null)
    setSubmitting(true)
    window.setTimeout(() => navigate('/', { replace: true }), 600)
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-navy-900 lg:flex-row">
      <img
        src="/assets/photos/background_login.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-br from-navy-950/90 via-navy-900/75 to-navy-800/70" />

      {/* Brand panel — desktop */}
      <div className="relative hidden flex-1 flex-col justify-between p-12 xl:p-16 lg:flex">
        <GameGateLogo variant="light" className="text-3xl" />
        <div className="max-w-lg">
          <h1 className="font-display text-5xl font-extrabold leading-[1.08] text-white xl:text-6xl">
            Vive cada partido desde la mejor butaca.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/70">
            Compra tus boletos para la Liga Panameña de Fútbol de forma rápida, segura y sin filas.
          </p>
          <ul className="mt-8 space-y-3 text-white/80">
            {[
              'Selección de asiento en tiempo real',
              'Pago seguro en dólares ($)',
              'Boletos digitales al instante',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm font-medium">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/20 text-brand-400">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-white/45">© 2026 GameGate · Boletería Oficial LPF</p>
      </div>

      {/* Form side */}
      <div className="relative flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:flex-none lg:w-[500px] lg:bg-card lg:px-16 lg:py-0">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl bg-card p-7 shadow-card-lg sm:p-9 lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none">
            <div className="mb-8 lg:hidden">
              <GameGateLogo variant="dark" className="text-3xl" />
            </div>

            <h2 className="font-display text-2xl font-bold text-ink-900">Bienvenido de nuevo</h2>
            <p className="mt-1.5 text-sm text-ink-600">Inicia sesión para comprar tus boletos.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
              <Input
                id="email"
                type="email"
                label="Correo electrónico"
                placeholder="tu@correo.com"
                icon={<Mail className="h-4 w-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />

              <div>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Contraseña"
                  placeholder="••••••••"
                  icon={<Lock className="h-4 w-4" />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <div className="mt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-600 transition-colors hover:text-ink-900"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                  <a href="#" className="text-xs font-semibold text-brand-600 transition-colors hover:text-brand-700">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>

              {error && (
                <p className="rounded-control bg-danger/10 px-3 py-2 text-xs font-medium text-danger">{error}</p>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <>
                    Iniciar sesión
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-line" />
              <span className="text-xs font-medium text-ink-400">o</span>
              <span className="h-px flex-1 bg-line" />
            </div>

            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => navigate('/', { replace: true })}
            >
              <GoogleIcon />
              Continuar con Google
            </Button>

            <p className="mt-8 text-center text-sm text-ink-600">
              ¿No tienes una cuenta?{' '}
              <a href="#" className="font-semibold text-brand-600 transition-colors hover:text-brand-700">
                Regístrate
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

