import { Outlet } from 'react-router-dom'
import AppNav from '../nav/AppNav'

export default function LearnLayout() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--primary-bg)' }}>
      <AppNav />
      <main style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '32px 28px 64px',
      }}>
        <Outlet />
      </main>
    </div>
  )
}
