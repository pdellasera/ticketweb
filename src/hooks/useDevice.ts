import { useEffect, useState } from 'react'

const MOBILE_UA_RE =
  /Android|iPhone|iPad|iPod|Mobile|IEMobile|BlackBerry|Opera Mini|webOS|Windows Phone/i

/** At or below this viewport width a device is treated as phone-sized. */
const MOBILE_MAX_WIDTH = 768

/**
 * Detects whether the current device is a phone/tablet (i.e. "celular").
 *
 * Heuristics:
 * 1. The user agent reports a mobile browser (Android, iOS, etc.).
 * 2. It is a touch screen at phone width — this also covers mobile browsers
 *    that spoof a desktop UA or are in "request desktop site" mode.
 *
 * A regular desktop browser (mouse, no touch) always returns `false`, even if
 * its window is resized down to a narrow width.
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return true
  }

  const ua = navigator.userAgent || ''
  const mobileUA = MOBILE_UA_RE.test(ua)
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const narrowViewport = window.innerWidth <= MOBILE_MAX_WIDTH

  return mobileUA || (hasTouch && narrowViewport)
}

/** React hook version of {@link isMobileDevice}; re-evaluates on resize/rotation. */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => isMobileDevice())

  useEffect(() => {
    const onChange = () => setIsMobile(isMobileDevice())
    window.addEventListener('resize', onChange)
    window.addEventListener('orientationchange', onChange)
    return () => {
      window.removeEventListener('resize', onChange)
      window.removeEventListener('orientationchange', onChange)
    }
  }, [])

  return isMobile
}
