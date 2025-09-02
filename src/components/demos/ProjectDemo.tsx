import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Code, 
  Eye, 
  Settings,
  ExternalLink,
  Download,
  Share2,
  Heart,
  MessageCircle,
  Zap,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';

interface ProjectDemoProps {
  projectId: string;
  title: string;
  description: string;
  demoUrl?: string;
  sourceCode?: string;
  technologies: string[];
  features: string[];
  isInteractive?: boolean;
  className?: string;
}

interface DemoState {
  isPlaying: boolean;
  isFullscreen: boolean;
  currentView: 'preview' | 'code' | 'settings';
  device: 'desktop' | 'tablet' | 'mobile';
  isLiked: boolean;
  likes: number;
  views: number;
}

const ProjectDemo: React.FC<ProjectDemoProps> = ({
  projectId,
  title,
  description,
  demoUrl,
  sourceCode,
  technologies,
  features,
  isInteractive = true,
  className = ''
}) => {
  const [demoState, setDemoState] = useState<DemoState>({
    isPlaying: false,
    isFullscreen: false,
    currentView: 'preview',
    device: 'desktop',
    isLiked: false,
    likes: Math.floor(Math.random() * 100) + 20,
    views: Math.floor(Math.random() * 1000) + 100
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Update views when demo starts playing
    if (demoState.isPlaying) {
      setDemoState(prev => ({ ...prev, views: prev.views + 1 }));
    }
  }, [demoState.isPlaying]);

  const togglePlay = () => {
    setDemoState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const toggleFullscreen = () => {
    if (!demoState.isFullscreen) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setDemoState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }));
  };

  const resetDemo = () => {
    setDemoState(prev => ({ ...prev, isPlaying: false }));
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const toggleLike = () => {
    setDemoState(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
    }));
  };

  const shareDemo = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} - Interactive Demo`,
          text: description,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getDeviceStyles = () => {
    switch (demoState.device) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      default:
        return 'w-full';
    }
  };

  const getDeviceIcon = () => {
    switch (demoState.device) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Device Selector */}
          <div className="flex bg-white/10 rounded-lg p-1">
            {(['desktop', 'tablet', 'mobile'] as const).map((device) => (
              <button
                key={device}
                onClick={() => setDemoState(prev => ({ ...prev, device }))}
                className={`p-2 rounded transition-colors ${
                  demoState.device === device
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'text-gray-400 hover:text-white'
                }`}
                title={`${device} view`}
              >
                {device === 'desktop' && <Monitor className="w-4 h-4" />}
                {device === 'tablet' && <Tablet className="w-4 h-4" />}
                {device === 'mobile' && <Smartphone className="w-4 h-4" />}
              </button>
            ))}
          </div>

          {/* View Selector */}
          <div className="flex bg-white/10 rounded-lg p-1">
            {(['preview', 'code', 'settings'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setDemoState(prev => ({ ...prev, currentView: view }))}
                className={`p-2 rounded transition-colors ${
                  demoState.currentView === view
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'text-gray-400 hover:text-white'
                }`}
                title={view}
              >
                {view === 'preview' && <Eye className="w-4 h-4" />}
                {view === 'code' && <Code className="w-4 h-4" />}
                {view === 'settings' && <Settings className="w-4 h-4" />}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-2 bg-emerald-500/20 text-emerald-300 rounded-lg hover:bg-emerald-500/30 transition-colors"
              title={demoState.isPlaying ? 'Pause' : 'Play'}
            >
              {demoState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            
            <button
              onClick={resetDemo}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title={demoState.isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {demoState.isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {demoState.currentView === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`${getDeviceStyles()} transition-all duration-300`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center h-96 bg-gray-900/50">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-400">Loading demo...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-96 bg-red-900/20">
                  <div className="text-center">
                    <p className="text-red-400 mb-2">Failed to load demo</p>
                    <button
                      onClick={() => setError(null)}
                      className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {demoUrl ? (
                    <iframe
                      ref={iframeRef}
                      src={demoUrl}
                      className="w-full h-96 border-0"
                      title={`${title} Demo`}
                      sandbox="allow-scripts allow-same-origin allow-forms"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-96 bg-gradient-to-br from-emerald-900/20 to-blue-900/20">
                      <div className="text-center">
                        <Zap className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                        <h4 className="text-xl font-semibold text-white mb-2">Interactive Demo</h4>
                        <p className="text-gray-400 mb-4">Experience {title} in action</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {features.slice(0, 3).map((feature, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Play Overlay */}
                  {!demoState.isPlaying && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer"
                      onClick={togglePlay}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-20 h-20 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-full flex items-center justify-center"
                      >
                        <Play className="w-8 h-8 text-emerald-300 ml-1" />
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {demoState.currentView === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6"
            >
              <div className="bg-gray-900/50 rounded-lg p-4 h-96 overflow-auto">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">Source Code</h4>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {sourceCode ? (
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                    <code>{sourceCode}</code>
                  </pre>
                ) : (
                  <div className="text-center text-gray-400 mt-20">
                    <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Source code will be available soon</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {demoState.currentView === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6"
            >
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Project Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <h5 className="font-medium text-emerald-300 mb-2">Technologies</h5>
                      <div className="flex flex-wrap gap-2">
                        {technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4">
                      <h5 className="font-medium text-emerald-300 mb-2">Features</h5>
                      <ul className="space-y-1">
                        {features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <h5 className="font-medium text-emerald-300 mb-3">Demo Statistics</h5>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{demoState.views}</div>
                      <div className="text-sm text-gray-400">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{demoState.likes}</div>
                      <div className="text-sm text-gray-400">Likes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{Math.floor(Math.random() * 50) + 10}</div>
                      <div className="text-sm text-gray-400">Shares</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t border-white/20">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
              demoState.isLiked
                ? 'bg-red-500/20 text-red-300'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Heart className={`w-4 h-4 ${demoState.isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{demoState.likes}</span>
          </button>
          
          <button className="flex items-center gap-2 px-3 py-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">Comment</span>
          </button>
          
          <button
            onClick={shareDemo}
            className="flex items-center gap-2 px-3 py-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm">Share</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Eye className="w-4 h-4" />
          <span>{demoState.views} views</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectDemo;