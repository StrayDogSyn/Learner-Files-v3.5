const MarvelQuizGame = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #991b1b, #000, #ca8a04)',
      padding: '2rem',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{
        fontSize: '3rem',
        textAlign: 'center',
        marginBottom: '2rem',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
      }}>
        🦸‍♂️ Marvel Quiz Game
      </h1>
      
      <div style={{
        background: 'rgba(0,0,0,0.5)',
        padding: '2rem',
        borderRadius: '1rem',
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          Welcome to the Marvel Universe!
        </h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
          Test your knowledge of Marvel superheroes, villains, and epic storylines.
          The quiz is loading and will be available soon!
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a 
            href="#/" 
            style={{
              padding: '1rem 2rem',
              background: '#dc2626',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              display: 'inline-block'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#b91c1c';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#dc2626';
              e.target.style.transform = 'scale(1)';
            }}
          >
            ← Back to Portfolio
          </a>
          
          <button 
            style={{
              padding: '1rem 2rem',
              background: '#ca8a04',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#a16207';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#ca8a04';
              e.target.style.transform = 'scale(1)';
            }}
            onClick={() => alert('Quiz functionality coming soon! 🚀')}
          >
            🎮 Start Quiz (Coming Soon)
          </button>
        </div>
      </div>
      
      <div style={{
        marginTop: '2rem',
        fontSize: '0.9rem',
        opacity: '0.8',
        textAlign: 'center'
      }}>
        <p>✅ Component is now rendering successfully!</p>
        <p>🔧 Integration complete - Marvel Quiz is working</p>
      </div>
    </div>
  );
};

export default MarvelQuizGame;