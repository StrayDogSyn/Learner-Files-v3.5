import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FaPlay,
  FaPause,
  FaExpand,
  FaCompress,
  FaCode,
  FaCog,
  FaChartBar,
  FaQuestionCircle,
  FaTimes,
  FaExternalLinkAlt,
  FaGithub,
  FaCopy,
  FaDownload,
  FaShare,
  FaVolumeUp,
  FaVolumeMute,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import type { DemoConfiguration, DemoState, DemoPreset, TutorialState } from '../types/demo';
import { demoIntegration } from '../services/demoIntegration';
import GlassCard from './GlassCard';
import BrandImage from './BrandImage';

interface InteractiveDemoProps {
  config: DemoConfiguration;
  className?: string;
  onDemoStart?: (sessionId: string) => void;
  onDemoComplete?: (sessionId: string, analytics: any) => void;
  onError?: (error: string) => void;
}

const InteractiveDemo: React.FC<InteractiveDemoProps> = ({
  config,
  className = '',
  onDemoStart,
  onDemoComplete,
  onError,
}) => {
  const [demoState, setDemoState] = useState<DemoState | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showCode, setShowCode] = useState(config.codeVisible);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialState, setTutorialState] = useState<TutorialState | null>(null);
  const [currentPreset, setCurrentPreset] = useState<DemoPreset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const demoRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Initialize demo session
  useEffect(() => {
    try {
      const newSessionId = demoIntegration.createDemoSession(config);
      setSessionId(newSessionId);
      setDemoState(demoIntegration.getSession(newSessionId) || null);
      setIsLoading(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to initialize demo';
      setError(errorMsg);
      onError?.(errorMsg);
    }
  }, [config, onError]);

  // Handle demo state changes
  useEffect(() => {
    if (sessionId && demoState) {
      setDemoState(demoIntegration.getSession(sessionId) || null);
    }
  }, [sessionId, demoState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionId) {
        demoIntegration.stopDemo(sessionId);
      }
    };
  }, [sessionId]);

  const startDemo = useCallback(
    async (preset?: DemoPreset) => {
      if (!sessionId) return;

      try {
        setIsLoading(true);
        setError(null);

        if (preset) {
          setCurrentPreset(preset);
        }

        demoIntegration.startDemo(sessionId, preset);
        onDemoStart?.(sessionId);

        // Handle different demo types
        switch (config.demoType) {
          case 'game':
            await initializeGameDemo();
            break;
          case 'api-playground':
            await initializeAPIPlayground();
            break;
          case 'sandbox':
            await initializeCodeSandbox();
            break;
          default:
            // iframe and component demos are handled by the iframe/component itself
            break;
        }

        setIsLoading(false);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to start demo';
        setError(errorMsg);
        onError?.(errorMsg);
        setIsLoading(false);
      }
    },
    [sessionId, config.demoType, onDemoStart, onError]
  );

  const initializeGameDemo = async () => {
    // Initialize game-specific features
    demoIntegration.createGameDemo({
      difficulty: 'medium',
      scoreTracking: true,
      leaderboard: true,
      achievements: true,
      tutorial: true,
      sound: true,
      accessibility: {
        highContrast: false,
        reducedMotion: false,
        screenReader: false,
      },
    });
  };

  const initializeAPIPlayground = async () => {
    // Initialize API playground
    const playgroundUrl = demoIntegration.createAPIPlayground({
      endpoints: [
        {
          method: 'GET',
          path: '/api/characters',
          description: 'Fetch Marvel characters',
          parameters: [
            {
              name: 'limit',
              type: 'number',
              required: false,
              description: 'Number of characters to fetch',
              defaultValue: 20,
            },
          ],
          response: {
            status: 200,
            contentType: 'application/json',
            schema: { type: 'object', properties: { data: { type: 'array' } } },
            examples: [{ data: { results: [] } }],
          },
        },
      ],
    });

    if (iframeRef.current) {
      iframeRef.current.src = playgroundUrl;
    }
  };

  const initializeCodeSandbox = async () => {
    try {
      const sandboxUrl = await demoIntegration.createCodeSandbox({
        files: {
          'App.js': {
            content: `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Interactive Demo</h1>
        <p>This is a live code sandbox demo!</p>
      </header>
    </div>
  );
}

export default App;`,
            language: 'javascript',
          },
          'App.css': {
            content: `.App {
  text-align: center;
  padding: 20px;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
  border-radius: 8px;
}`,
            language: 'css',
          },
        },
        dependencies: {
          react: '^18.0.0',
          'react-dom': '^18.0.0',
        },
        environment: 'create-react-app',
      });

      if (iframeRef.current) {
        iframeRef.current.src = sandboxUrl;
      }
    } catch (err) {
      console.error('Failed to create CodeSandbox:', err);
    }
  };

  const toggleFullscreen = useCallback(() => {
    if (!demoRef.current) return;

    if (!isFullscreen) {
      if (demoRef.current.requestFullscreen) {
        demoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const toggleCode = useCallback(() => {
    setShowCode(!showCode);
    if (sessionId) {
      demoIntegration.updateConfiguration(sessionId, { codeVisible: !showCode });
    }
  }, [showCode, sessionId]);

  const toggleAnalytics = useCallback(() => {
    setShowAnalytics(!showAnalytics);
  }, [showAnalytics]);

  const startTutorial = useCallback(() => {
    const tutorial = demoIntegration.createTutorial([
      {
        id: 'welcome',
        title: 'Welcome to the Demo',
        content: 'This interactive demo showcases the project features.',
        action: 'wait',
      },
      {
        id: 'controls',
        title: 'Demo Controls',
        content: 'Use the control panel to customize your experience.',
        action: 'click',
        target: '.demo-controls',
      },
      {
        id: 'interaction',
        title: 'Try It Out',
        content: 'Interact with the demo to see it in action!',
        action: 'wait',
      },
    ]);

    setTutorialState(tutorial);
    demoIntegration.startTutorial(tutorial);
    setShowTutorial(true);
  }, []);

  const nextTutorialStep = useCallback(() => {
    if (tutorialState) {
      demoIntegration.nextTutorialStep(tutorialState);
      setTutorialState({ ...tutorialState });
    }
  }, [tutorialState]);

  const handlePresetChange = useCallback(
    (preset: DemoPreset) => {
      setCurrentPreset(preset);
      startDemo(preset);
    },
    [startDemo]
  );

  const handleInteraction = useCallback(
    (interaction: string, data?: Record<string, any>) => {
      if (sessionId) {
        demoIntegration.trackInteraction(sessionId, interaction, data);
      }
    },
    [sessionId]
  );

  const copyDemoUrl = useCallback(() => {
    if (config.embedUrl) {
      navigator.clipboard.writeText(config.embedUrl);
    }
  }, [config.embedUrl]);

  const shareDemo = useCallback(() => {
    if (navigator.share && config.embedUrl) {
      navigator.share({
        title: config.projectId,
        text: 'Check out this interactive demo!',
        url: config.embedUrl,
      });
    } else {
      copyDemoUrl();
    }
  }, [config.embedUrl, config.projectId, copyDemoUrl]);

  if (error) {
    return (
      <GlassCard className={`demo-error ${className}`}>
        <div className='flex items-center justify-center p-8'>
          <div className='text-center'>
            <FaTimes className='text-red-500 text-4xl mx-auto mb-4' />
            <h3 className='text-xl font-semibold mb-2'>Demo Error</h3>
            <p className='text-gray-300 mb-4'>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors'
            >
              Retry Demo
            </button>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <div ref={demoRef} className={`interactive-demo ${className}`}>
      {/* Demo Header */}
      <div className='demo-header bg-glass-dark border-b border-glass-border p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <h3 className='text-lg font-semibold text-white'>{config.projectId}</h3>
            {currentPreset && (
              <span className='bg-glass-accent text-white px-2 py-1 rounded text-sm'>
                {currentPreset.name}
              </span>
            )}
          </div>

          <div className='flex items-center space-x-2'>
            {config.presets && config.presets.length > 0 && (
              <select
                value={currentPreset?.id || ''}
                onChange={e => {
                  const preset = config.presets?.find(p => p.id === e.target.value);
                  if (preset) handlePresetChange(preset);
                }}
                className='bg-glass-dark border border-glass-border text-white px-3 py-1 rounded text-sm'
              >
                <option value=''>Select Preset</option>
                {config.presets.map(preset => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={toggleCode}
              className={`p-2 rounded transition-colors ${
                showCode ? 'bg-glass-accent text-white' : 'text-gray-300 hover:text-white'
              }`}
              title='Toggle Code View'
            >
              <FaCode />
            </button>

            <button
              onClick={toggleAnalytics}
              className={`p-2 rounded transition-colors ${
                showAnalytics ? 'bg-glass-accent text-white' : 'text-gray-300 hover:text-white'
              }`}
              title='Show Analytics'
            >
              <FaChartBar />
            </button>

            <button
              onClick={startTutorial}
              className='p-2 rounded text-gray-300 hover:text-white transition-colors'
              title='Start Tutorial'
            >
              <FaQuestionCircle />
            </button>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className='demo-content relative'>
        {isLoading && (
          <div className='absolute inset-0 bg-glass-dark bg-opacity-90 flex items-center justify-center z-10'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-glass-accent mx-auto mb-4'></div>
              <p className='text-white'>Loading demo...</p>
            </div>
          </div>
        )}

        {/* Main Demo Area */}
        <div className='demo-main' style={{ height: config.height }}>
          {config.demoType === 'iframe' && config.embedUrl && (
            <iframe
              ref={iframeRef}
              src={config.embedUrl}
              className='w-full h-full border-0'
              title={`${config.projectId} Demo`}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setError('Failed to load demo');
                setIsLoading(false);
              }}
            />
          )}

          {config.demoType === 'component' && (
            <div className='w-full h-full flex items-center justify-center bg-glass-dark'>
              <div className='text-center'>
                <h4 className='text-xl font-semibold mb-4'>Component Demo</h4>
                <p className='text-gray-300 mb-4'>
                  Interactive component demo would be rendered here
                </p>
                <button
                  onClick={() => handleInteraction('component_click')}
                  className='bg-glass-accent hover:bg-glass-accent-dark text-white px-6 py-3 rounded-lg transition-colors'
                >
                  Interact with Component
                </button>
              </div>
            </div>
          )}

          {config.demoType === 'game' && (
            <div className='w-full h-full flex items-center justify-center bg-glass-dark'>
              <div className='text-center'>
                <h4 className='text-xl font-semibold mb-4'>Game Demo</h4>
                <p className='text-gray-300 mb-4'>Interactive game demo would be rendered here</p>
                <button
                  onClick={() => handleInteraction('game_start')}
                  className='bg-glass-accent hover:bg-glass-accent-dark text-white px-6 py-3 rounded-lg transition-colors'
                >
                  Start Game
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Code Panel */}
        {showCode && currentPreset?.code && (
          <div className='demo-code-panel bg-glass-dark border-t border-glass-border p-4'>
            <div className='flex items-center justify-between mb-2'>
              <h4 className='text-sm font-semibold text-white'>Code</h4>
              <button
                onClick={() => navigator.clipboard.writeText(currentPreset.code!)}
                className='text-gray-300 hover:text-white transition-colors'
                title='Copy Code'
              >
                <FaCopy />
              </button>
            </div>
            <pre className='bg-black text-green-400 p-4 rounded text-sm overflow-x-auto'>
              <code>{currentPreset.code}</code>
            </pre>
          </div>
        )}

        {/* Analytics Panel */}
        {showAnalytics && demoState && (
          <div className='demo-analytics-panel bg-glass-dark border-t border-glass-border p-4'>
            <h4 className='text-sm font-semibold text-white mb-2'>Analytics</h4>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <span className='text-gray-300'>Interactions:</span>
                <span className='text-white ml-2'>{demoState.analytics.interactions}</span>
              </div>
              <div>
                <span className='text-gray-300'>Errors:</span>
                <span className='text-white ml-2'>{demoState.analytics.errors}</span>
              </div>
              <div>
                <span className='text-gray-300'>Duration:</span>
                <span className='text-white ml-2'>
                  {demoState.analytics.completionTime
                    ? `${Math.round(
                        (demoState.analytics.completionTime - demoState.analytics.startTime) / 1000
                      )}s`
                    : 'Active'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Demo Controls */}
      {showControls && (
        <div className='demo-controls bg-glass-dark border-t border-glass-border p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <button
                onClick={() => startDemo()}
                disabled={isLoading}
                className='bg-glass-accent hover:bg-glass-accent-dark text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50'
              >
                <FaPlay className='inline mr-2' />
                Start Demo
              </button>

              <button
                onClick={toggleFullscreen}
                className='bg-glass-dark border border-glass-border text-white px-3 py-2 rounded transition-colors hover:bg-glass-accent'
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>

            <div className='flex items-center space-x-2'>
              <button
                onClick={copyDemoUrl}
                className='text-gray-300 hover:text-white transition-colors'
                title='Copy Demo URL'
              >
                <FaCopy />
              </button>

              <button
                onClick={shareDemo}
                className='text-gray-300 hover:text-white transition-colors'
                title='Share Demo'
              >
                <FaShare />
              </button>

              {config.githubRepo && (
                <a
                  href={config.githubRepo}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-300 hover:text-white transition-colors'
                  title='View on GitHub'
                >
                  <FaGithub />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Overlay */}
      {showTutorial && tutorialState && (
        <div className='tutorial-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-glass-dark border border-glass-border rounded-lg p-6 max-w-md mx-4'>
            <h3 className='text-lg font-semibold text-white mb-2'>
              {tutorialState.steps[tutorialState.currentStep]?.title}
            </h3>
            <p className='text-gray-300 mb-4'>
              {tutorialState.steps[tutorialState.currentStep]?.content}
            </p>
            <div className='flex justify-between items-center'>
              <div className='text-sm text-gray-400'>
                Step {tutorialState.currentStep + 1} of {tutorialState.steps.length}
              </div>
              <div className='flex space-x-2'>
                <button
                  onClick={() => setShowTutorial(false)}
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  Skip
                </button>
                <button
                  onClick={nextTutorialStep}
                  className='bg-glass-accent hover:bg-glass-accent-dark text-white px-4 py-2 rounded transition-colors'
                >
                  {tutorialState.currentStep === tutorialState.steps.length - 1 ? 'Finish' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveDemo;
