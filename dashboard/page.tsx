// app/dashboard/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  return (
    <main
      style={{
        backgroundColor: '#F5F1EA',
        minHeight: '100vh',
        fontFamily: "'Instrument Sans', sans-serif",
        color: '#0E0C09',
        padding: '64px max(48px, 8vw)',
      }}
    >
      <div style={{ height: '2px', backgroundColor: '#0E0C09', marginBottom: '48px' }} />
      <p style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '48px', fontFamily: "'Playfair Display', serif" }}>
        Broke Founders — Dashboard
      </p>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, marginBottom: '16px' }}>
        Welcome back, {session.user.username}.
      </h1>
      <p style={{ opacity: 0.5, fontSize: '15px' }}>
        Auth is working. Next: seed creation flow.
      </p>
    </main>
  )
}