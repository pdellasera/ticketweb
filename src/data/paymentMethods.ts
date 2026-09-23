import type { PaymentMethod } from './types'

/** Payment methods shown on the checkout "Método de pago" card. */
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'card',
    title: 'Tarjeta de crédito o débito',
    hint: 'Visa, Mastercard, American Express',
    brands: ['visa', 'mastercard', 'amex'],
  },
  {
    id: 'yappy',
    title: 'Yappy',
    hint: 'Paga fácil desde tu celular',
  },
]
