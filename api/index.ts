import app from './app.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Marvel Quiz API Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🦸 Marvel API proxy: http://localhost:${PORT}/api/marvel`);
});

export default app;