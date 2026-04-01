import GenieForm from '@/components/GenieForm'

export default function Home() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      width: '100%',
      maxWidth: 600,
    }}>
      <div className="fairy-container fade-in" style={{ marginBottom: 0, marginRight: 39 }}>
        <div className="fairy-glow" />
        <img
          src="/fairy.gif"
          alt="Utopia Fairy"
          style={{
            width: 140,
            height: 140,
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 20px rgba(79, 195, 247, 0.4))',
          }}
        />
      </div>
      <h1
        className="fade-in"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 34,
          fontWeight: 400,
          color: 'var(--accent-fairy)',
          letterSpacing: '3px',
          margin: 0,
          textShadow: '0 0 30px rgba(129, 212, 250, 0.3)',
          animationDelay: '0.15s',
        }}
      >
        Utopia Fairy
      </h1>
      <p
        className="fade-in"
        style={{
          color: 'var(--text-muted)',
          fontSize: 14,
          marginBottom: 20,
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          letterSpacing: '0.3px',
          animationDelay: '0.3s',
        }}
      >
        Your wish is my command — what website shall I create today?
      </p>
      <div className="fade-in" style={{ width: '100%', animationDelay: '0.45s' }}>
        <GenieForm />
      </div>
    </main>
  )
}
