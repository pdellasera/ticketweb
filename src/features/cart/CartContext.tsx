import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react'

export interface CartLine {
  key: string
  eventTitle: string
  eventMeta: string
  zoneLabel: string
  seatIds: string[]
  quantity?: number
  unitPrice: number
  currency: 'USD'
  badgeCode?: string
}

interface CartState {
  lines: CartLine[]
}

type CartAction =
  | { type: 'ADD_LINE'; line: CartLine }
  | { type: 'REMOVE_LINE'; key: string }
  | { type: 'CLEAR' }

const SERVICE_FEE = 1.5

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_LINE': {
      const existing = state.lines.find((l) => l.key === action.line.key)
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.key === action.line.key
              ? {
                  ...l,
                  seatIds: Array.from(new Set([...l.seatIds, ...action.line.seatIds])),
                  quantity: (l.quantity ?? l.seatIds.length) + (action.line.quantity ?? action.line.seatIds.length),
                }
              : l,
          ),
        }
      }
      return { lines: [...state.lines, action.line] }
    }
    case 'REMOVE_LINE':
      return { lines: state.lines.filter((l) => l.key !== action.key) }
    case 'CLEAR':
      return { lines: [] }
  }
}

export interface CartContextValue {
  lines: CartLine[]
  itemCount: number
  subtotal: number
  fees: number
  total: number
  addLine: (line: CartLine) => void
  removeLine: (key: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [] })

  const addLine = useCallback((line: CartLine) => dispatch({ type: 'ADD_LINE', line }), [])
  const removeLine = useCallback((key: string) => dispatch({ type: 'REMOVE_LINE', key }), [])
  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), [])

  const value = useMemo<CartContextValue>(() => {
    const itemCount = state.lines.reduce((sum, l) => sum + (l.quantity ?? l.seatIds.length), 0)
    const subtotal = state.lines.reduce((sum, l) => sum + l.unitPrice * (l.quantity ?? l.seatIds.length), 0)
    const fees = itemCount * SERVICE_FEE
    return {
      lines: state.lines,
      itemCount,
      subtotal,
      fees,
      total: subtotal + fees,
      addLine,
      removeLine,
      clear,
    }
  }, [state, addLine, removeLine, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
