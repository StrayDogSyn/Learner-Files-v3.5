import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Download, 
  Upload, 
  Copy, 
  Share2, 
  Settings, 
  Code, 
  Eye, 
  EyeOff,
  Maximize2,
  Minimize2,
  FileText,
  Save,
  FolderOpen,
  Zap,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

interface CodeFile {
  id: string;
  name: string;
  content: string;
  language: 'javascript' | 'typescript' | 'html' | 'css' | 'json';
  isActive: boolean;
}

interface ConsoleMessage {
  id: string;
  type: 'log' | 'error' | 'warn' | 'info';
  content: string;
  timestamp: Date;
}

interface CodePlaygroundProps {
  projectId: string;
  initialFiles?: CodeFile[];
  title?: string;
  description?: string;
  className?: string;
}

const CodePlayground: React.FC<CodePlaygroundProps> = ({
  projectId,
  initialFiles = [],
  title = 'Code Playground',
  description = 'Experiment with live code',
  className = ''
}) => {
  const [files, setFiles] = useState<CodeFile[]>(initialFiles.length > 0 ? initialFiles : [
    {
      id: '1',
      name: 'index.html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Demo</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: white;
            margin-bottom: 20px;
            font-size: 2.5em;
        }
        p {
            color: rgba(255, 255, 255, 0.8);
            font-size: 1.2em;
            margin-bottom: 30px;
        }
        .btn {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 12px 24px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 1em;
            transition: all 0.3s ease;
        }
        .btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Welcome to the Playground!</h1>
        <p>Edit the code and see your changes live</p>
        <button class="btn" onclick="showMessage()">Click me!</button>
    </div>
    
    <script>
        function showMessage() {
            alert('Hello from the playground! 🎉');
            console.log('Button clicked at:', new Date().toLocaleTimeString());
        }
        
        console.log('Playground initialized successfully!');
    </script>
</body>
</html>`,
      language: 'html',
      isActive: true
    }
  ]);
  
  const [isRunning, setIsRunning] = useState(false);
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [showConsole, setShowConsole] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settings, setSettings] = useState({
    autoRun: true,
    fontSize: 14,
    theme: 'dark',
    showLineNumbers: true
  });
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeFile = files.find(file => file.isActive) || files[0];

  useEffect(() => {
    if (settings.autoRun) {
      const timer = setTimeout(() => {
        runCode();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [activeFile?.content, settings.autoRun]);

  const addConsoleMessage = useCallback((type: ConsoleMessage['type'], content: string) => {
    const message: ConsoleMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setConsoleMessages(prev => [...prev, message]);
  }, []);

  const runCode = useCallback(() => {
    if (!activeFile) return;
    
    setIsRunning(true);
    setConsoleMessages([]);
    
    try {
      if (activeFile.language === 'html') {
        // Create a blob URL for the HTML content
        const htmlContent = activeFile.content;
        
        // Inject console capture script
        const modifiedContent = htmlContent.replace(
          '</head>',
          `
          <script>
            // Capture console messages
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;
            const originalInfo = console.info;
            
            console.log = function(...args) {
              window.parent.postMessage({
                type: 'console',
                level: 'log',
                message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
              }, '*');
              originalLog.apply(console, args);
            };
            
            console.error = function(...args) {
              window.parent.postMessage({
                type: 'console',
                level: 'error',
                message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
              }, '*');
              originalError.apply(console, args);
            };
            
            console.warn = function(...args) {
              window.parent.postMessage({
                type: 'console',
                level: 'warn',
                message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
              }, '*');
              originalWarn.apply(console, args);
            };
            
            console.info = function(...args) {
              window.parent.postMessage({
                type: 'console',
                level: 'info',
                message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
              }, '*');
              originalInfo.apply(console, args);
            };
            
            // Capture errors
            window.addEventListener('error', function(e) {
              window.parent.postMessage({
                type: 'console',
                level: 'error',
                message: e.message + ' at line ' + e.lineno
              }, '*');
            });
          </script>
          </head>`
        );
        
        const blob = new Blob([modifiedContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        if (iframeRef.current) {
          iframeRef.current.src = url;
        }
        
        addConsoleMessage('info', 'Code executed successfully');
      }
    } catch (error) {
      addConsoleMessage('error', `Execution error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  }, [activeFile, addConsoleMessage]);

  const stopCode = () => {
    setIsRunning(false);
    if (iframeRef.current) {
      iframeRef.current.src = 'about:blank';
    }
    addConsoleMessage('info', 'Execution stopped');
  };

  const resetCode = () => {
    if (initialFiles.length > 0) {
      setFiles(initialFiles);
    } else {
      // Reset to default
      setFiles(prev => prev.map(file => ({
        ...file,
        content: file.id === '1' ? initialFiles[0]?.content || file.content : file.content
      })));
    }
    setConsoleMessages([]);
    addConsoleMessage('info', 'Code reset to initial state');
  };

  const updateFileContent = (fileId: string, content: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, content } : file
    ));
  };

  const setActiveFile = (fileId: string) => {
    setFiles(prev => prev.map(file => ({
      ...file,
      isActive: file.id === fileId
    })));
  };

  const addNewFile = () => {
    const newFile: CodeFile = {
      id: Date.now().toString(),
      name: `file${files.length + 1}.js`,
      content: '// New file\nconsole.log("Hello from new file!");',
      language: 'javascript',
      isActive: false
    };
    setFiles(prev => [...prev, newFile]);
  };

  const downloadCode = () => {
    if (!activeFile) return;
    
    const blob = new Blob([activeFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyCode = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    addConsoleMessage('info', 'Code copied to clipboard');
  };

  const shareCode = async () => {
    if (!activeFile) return;
    
    const shareData = {
      title: `${title} - ${activeFile.name}`,
      text: 'Check out this code playground!',
      url: window.location.href
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        copyCode();
      }
    } else {
      copyCode();
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const getConsoleIcon = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'warn':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-400" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
  };

  // Listen for console messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'console') {
        addConsoleMessage(event.data.level, event.data.message);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [addConsoleMessage]);

  return (
    <div 
      ref={containerRef}
      className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={isRunning ? stopCode : runCode}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
              isRunning
                ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
            }`}
          >
            {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="text-sm">{isRunning ? 'Stop' : 'Run'}</span>
          </button>
          
          <button
            onClick={resetCode}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <div className="flex bg-white/10 rounded-lg p-1">
            <button
              onClick={downloadCode}
              className="p-1 text-gray-400 hover:text-white rounded transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={copyCode}
              className="p-1 text-gray-400 hover:text-white rounded transition-colors"
              title="Copy"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={shareCode}
              className="p-1 text-gray-400 hover:text-white rounded transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={toggleFullscreen}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* File Tabs */}
      <div className="flex items-center gap-1 p-2 bg-white/5 border-b border-white/10">
        {files.map((file) => (
          <button
            key={file.id}
            onClick={() => setActiveFile(file.id)}
            className={`flex items-center gap-2 px-3 py-1 rounded transition-colors ${
              file.isActive
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileText className="w-3 h-3" />
            <span className="text-sm">{file.name}</span>
          </button>
        ))}
        
        <button
          onClick={addNewFile}
          className="p-1 text-gray-400 hover:text-white rounded transition-colors ml-2"
          title="Add file"
        >
          <FolderOpen className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex h-96">
        {/* Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-2 bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-white font-medium">Editor</span>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <input
                  type="checkbox"
                  checked={settings.autoRun}
                  onChange={(e) => setSettings(prev => ({ ...prev, autoRun: e.target.checked }))}
                  className="rounded"
                />
                Auto-run
              </label>
            </div>
          </div>
          
          <textarea
            ref={editorRef}
            value={activeFile?.content || ''}
            onChange={(e) => activeFile && updateFileContent(activeFile.id, e.target.value)}
            className="flex-1 bg-gray-900/50 text-white p-4 font-mono text-sm resize-none focus:outline-none"
            style={{ fontSize: `${settings.fontSize}px` }}
            placeholder="Write your code here..."
            spellCheck={false}
          />
        </div>

        {/* Preview */}
        <div className="flex-1 flex flex-col border-l border-white/20">
          <div className="flex items-center justify-between p-2 bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-white font-medium">Preview</span>
            </div>
            
            <button
              onClick={() => setShowConsole(!showConsole)}
              className="flex items-center gap-2 px-2 py-1 text-sm text-gray-400 hover:text-white rounded transition-colors"
            >
              {showConsole ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              Console
            </button>
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className={`${showConsole ? 'flex-1' : 'h-full'} bg-white`}>
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0"
                title="Code Preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
              />
            </div>
            
            {/* Console */}
            <AnimatePresence>
              {showConsole && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 120 }}
                  exit={{ height: 0 }}
                  className="bg-gray-900/80 border-t border-white/20 overflow-hidden"
                >
                  <div className="flex items-center justify-between p-2 border-b border-white/10">
                    <span className="text-sm text-white font-medium">Console</span>
                    <button
                      onClick={() => setConsoleMessages([])}
                      className="text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  
                  <div className="h-20 overflow-y-auto p-2 space-y-1">
                    {consoleMessages.map((message) => (
                      <div
                        key={message.id}
                        className="flex items-start gap-2 text-xs"
                      >
                        {getConsoleIcon(message.type)}
                        <span className="text-gray-400">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        <span className="text-white flex-1">{message.content}</span>
                      </div>
                    ))}
                    
                    {consoleMessages.length === 0 && (
                      <div className="text-center text-gray-500 text-xs py-4">
                        Console output will appear here
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePlayground;