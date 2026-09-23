import type { CardBrand } from '@/data/types'

/** Hand-drawn inline approximations of the Visa / Mastercard / Amex marks. */
export function PaymentBrandMarks({ brands }: { brands: CardBrand[] }) {
  return (
    <div className="flex items-center" style={{ gap: 4, flexShrink: 0 }} aria-hidden="true">
      {brands.includes('visa') && (
        <svg width={38} height={24} viewBox="0 0 38 24">
          <rect width="38" height="24" rx="3" fill="#ffffff" />
          <text x="19" y="16" textAnchor="middle" fontStyle="italic" fontWeight="800" fontSize="11" fill="#1a1f71" fontFamily="Inter, system-ui, sans-serif">
            VISA
          </text>
        </svg>
      )}
      {brands.includes('mastercard') && (
        <svg width={38} height={24} viewBox="0 0 38 24">
          <rect width="38" height="24" rx="3" fill="#ffffff" />
          <circle cx="15" cy="12" r="8" fill="#eb001b" />
          <circle cx="23" cy="12" r="8" fill="#f79e1b" fillOpacity="0.9" />
        </svg>
      )}
      {brands.includes('amex') && (
        <svg width={38} height={24} viewBox="0 0 38 24">
          <rect width="38" height="24" rx="3" fill="#ffffff" />
          <rect x="3" y="4" width="32" height="16" rx="2.5" fill="#2e77bc" />
          <text x="19" y="15" textAnchor="middle" fontWeight="700" fontSize="8.5" fill="#ffffff" fontFamily="Inter, system-ui, sans-serif">
            AMEX
          </text>
        </svg>
      )}
    </div>
  )
}
