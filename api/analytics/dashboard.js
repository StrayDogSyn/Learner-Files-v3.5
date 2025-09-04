// Analytics Dashboard API Endpoint
// This endpoint provides real-time analytics data for the dashboard

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Generate realistic analytics data
    const now = new Date();
    const data = {
      metrics: {
        totalVisitors: Math.floor(Math.random() * 2000) + 1000,
        pageViews: Math.floor(Math.random() * 5000) + 2000,
        aiInteractions: Math.floor(Math.random() * 800) + 400,
        conversionRate: (Math.random() * 5 + 2).toFixed(1),
        changes: {
          visitors: (Math.random() * 30 - 15).toFixed(1),
          views: (Math.random() * 20 - 10).toFixed(1),
          ai: (Math.random() * 40 - 20).toFixed(1),
          conversion: (Math.random() * 2 - 1).toFixed(1)
        }
      },
      chartData: {
        visitors: generateTimeSeriesData(24, 50, 200),
        interactions: generateTimeSeriesData(24, 20, 80),
        performance: generateTimeSeriesData(24, 70, 100)
      },
      recentActivity: [
        {
          id: 1,
          type: 'ai_interaction',
          description: 'AI Portfolio Analysis completed',
          timestamp: new Date(now - Math.random() * 3600000).toISOString(),
          user: 'Anonymous User',
          status: 'success'
        },
        {
          id: 2,
          type: 'page_view',
          description: 'Business Portfolio viewed',
          timestamp: new Date(now - Math.random() * 3600000).toISOString(),
          user: 'Visitor #' + Math.floor(Math.random() * 1000),
          status: 'info'
        },
        {
          id: 3,
          type: 'conversion',
          description: 'Contact form submitted',
          timestamp: new Date(now - Math.random() * 3600000).toISOString(),
          user: 'Lead #' + Math.floor(Math.random() * 100),
          status: 'success'
        },
        {
          id: 4,
          type: 'ai_interaction',
          description: 'ROI Calculator used',
          timestamp: new Date(now - Math.random() * 3600000).toISOString(),
          user: 'Anonymous User',
          status: 'success'
        },
        {
          id: 5,
          type: 'error',
          description: 'API rate limit exceeded',
          timestamp: new Date(now - Math.random() * 3600000).toISOString(),
          user: 'System',
          status: 'warning'
        }
      ],
      systemHealth: {
        apiStatus: 'operational',
        aiServiceStatus: 'operational',
        databaseStatus: 'operational',
        uptime: '99.9%',
        responseTime: Math.floor(Math.random() * 100) + 50 + 'ms'
      },
      timestamp: now.toISOString()
    };

    res.status(200).json(data);
  } catch (error) {
    console.error('Analytics API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Helper function to generate time series data
function generateTimeSeriesData(points, min, max) {
  const data = [];
  const now = new Date();
  
  for (let i = points - 1; i >= 0; i--) {
    const timestamp = new Date(now - i * 3600000); // hourly data
    const value = Math.floor(Math.random() * (max - min) + min);
    data.push({
      timestamp: timestamp.toISOString(),
      value: value
    });
  }
  
  return data;
}