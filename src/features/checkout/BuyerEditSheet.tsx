import { useState } from 'react'
import { X } from 'lucide-react'

import type { Buyer } from '@/data/types'

interface Props {
  buyer: Buyer
  onSave: (buyer: Buyer) => void
  onClose: () => void
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 44,
  borderRadius: 10,
  border: '1px solid var(--color-zona-line)',
  background: '#fff',
  padding: '0 14px',
  fontSize: 14,
  color: 'var(--color-checkout-ink)',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--color-checkout-ink)',
  marginBottom: 6,
}

/** Bottom sheet to edit the buyer name / email / phone. */
export function BuyerEditSheet({ buyer, onSave, onClose }: Props) {
  const [name, setName] = useState(buyer.name)
  const [email, setEmail] = useState(buyer.email)
  const [phone, setPhone] = useState(buyer.phone)

  function handleSave() {
    onSave({ name: name.trim() || buyer.name, email: email.trim() || buyer.email, phone: phone.trim() || buyer.phone })
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: 'rgba(8,18,45,0.5)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 430,
          background: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: '20px 20px 28px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-checkout-ink)' }}>Datos del comprador</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="grid place-items-center"
            style={{ width: 32, height: 32, borderRadius: '50%', background: '#eef1f6', border: 'none', cursor: 'pointer', color: 'var(--color-pago-sub)' }}
          >
            <X style={{ width: 18, height: 18 }} strokeWidth={2.4} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 18 }}>
          <div>
            <label style={labelStyle} htmlFor="buyer-name">Nombre completo</label>
            <input id="buyer-name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="Tu nombre" />
          </div>
          <div>
            <label style={labelStyle} htmlFor="buyer-email">Correo electrónico</label>
            <input id="buyer-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="correo@email.com" />
          </div>
          <div>
            <label style={labelStyle} htmlFor="buyer-phone">Teléfono</label>
            <input id="buyer-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} placeholder="+507 6000-0000" />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          style={{
            width: '100%',
            height: 48,
            marginTop: 20,
            borderRadius: 10,
            background: 'var(--color-pago-blue)',
            color: '#fff',
            fontSize: 15,
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Guardar datos
        </button>
      </div>
    </div>
  )
}
