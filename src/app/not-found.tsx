import Link from "next/link"

export default function NotFound() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      textAlign: 'center',
      gap: '1rem',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>
        404 - Page not found
      </h1>
      <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>
        The page you are looking for does not exist.
      </p>
      <Link 
        href="/" 
        style={{ 
          backgroundColor: '#2563eb', 
          color: 'white', 
          padding: '0.5rem 1rem', 
          borderRadius: '0.375rem',
          textDecoration: 'none'
        }}
      >
        Return Home
      </Link>
    </div>
  )
} 