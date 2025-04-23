"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          textAlign: 'center',
          gap: '1rem',
          fontFamily: 'system-ui, sans-serif',
          backgroundColor: 'white',
          color: 'black'
        }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>
            Something went wrong!
          </h2>
          <p style={{ color: '#6b7280' }}>
            A critical error has occurred. Please try again later.
          </p>
          <button
            onClick={() => reset()}
            style={{ 
              backgroundColor: '#2563eb', 
              color: 'white', 
              padding: '0.5rem 1rem', 
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
} 