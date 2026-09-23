import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation, useParams, useSearchParams } from 'react-router-dom'

import { Spinner } from '@/components/ui/Spinner'
import MobileOnlyScreen from '@/features/mobile/MobileOnlyScreen'
import { useIsMobile } from '@/hooks/useDevice'

const LoginScreen = lazy(() => import('@/features/auth/LoginScreen'))
const HomeScreen = lazy(() => import('@/features/events/HomeScreen'))
const HomeMobileScreen = lazy(() => import('@/features/home/HomeMobileScreen'))
const MobileTabLayout = lazy(() => import('@/features/mobile/MobileTabLayout'))
const MobileEventsScreen = lazy(() => import('@/features/mobile/MobileEventsScreen'))
const MobileTicketsScreen = lazy(() => import('@/features/mobile/MobileTicketsScreen'))
const MobileProfileScreen = lazy(() => import('@/features/mobile/MobileProfileScreen'))
const MobileFlowLayout = lazy(() => import('@/features/checkout/MobileFlowLayout'))
const CalendarScreen = lazy(() => import('@/features/calendar/CalendarScreen'))
const CheckoutScreen = lazy(() => import('@/features/checkout/CheckoutScreen'))
const PaymentScreen = lazy(() => import('@/features/checkout/PaymentScreen'))
const PaymentProcessingScreen = lazy(() => import('@/features/checkout/PaymentProcessingScreen'))
const PaymentCompleteScreen = lazy(() => import('@/features/checkout/PaymentCompleteScreen'))
const PosScreen = lazy(() => import('@/features/pos/PosScreen'))
const SeatMapScreen = lazy(() => import('@/features/stadium/SeatMapScreen'))
const AppShell = lazy(() => import('@/features/shell/AppShell').then((m) => ({ default: m.AppShell })))

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas-soft">
      <Spinner className="h-6 w-6 text-brand-500" />
    </div>
  )
}

function AsientosRedirect() {
  const { eventId } = useParams()
  const [params] = useSearchParams()
  const zona = params.get('zona')
  return <Navigate to={`/comprar/${eventId}${zona ? `?zona=${zona}` : ''}`} replace />
}

export default function App() {
  const isMobile = useIsMobile()
  const { pathname } = useLocation()
  const isAdminConsole = pathname.startsWith('/consola') || pathname.startsWith('/estadio')

  // The customer-facing ticketera is mobile-only; desktop visitors see a notice.
  // The `/consola` admin panel stays available on desktop.
  if (!isMobile && !isAdminConsole) {
    return <MobileOnlyScreen />
  }

  return (
    <Suspense fallback={<FullScreenLoader />}>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route element={<MobileTabLayout />}>
          <Route path="/" element={<HomeMobileScreen />} />
          <Route path="/eventos" element={<MobileEventsScreen />} />
          <Route path="/eventos/calendario" element={<CalendarScreen />} />
          <Route path="/mis-entradas" element={<MobileTicketsScreen />} />
          <Route path="/perfil" element={<MobileProfileScreen />} />
        </Route>
        <Route element={<MobileFlowLayout />}>
          <Route path="/comprar/:eventId" element={<CheckoutScreen />} />
          <Route path="/comprar/:eventId/pago" element={<PaymentScreen />} />
          <Route path="/comprar/:eventId/procesando" element={<PaymentProcessingScreen />} />
          <Route path="/comprar/:eventId/confirmacion" element={<PaymentCompleteScreen />} />
          <Route path="/comprar/:eventId/asientos" element={<AsientosRedirect />} />
        </Route>
        <Route element={<AppShell />}>
          <Route path="/consola" element={<HomeScreen />} />
          <Route path="/consola/eventos" element={<HomeScreen />} />
          <Route path="/consola/asientos" element={<SeatMapScreen />} />
          <Route path="/consola/venta" element={<PosScreen />} />
        </Route>
        <Route path="/estadio" element={<Navigate to="/consola" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}



