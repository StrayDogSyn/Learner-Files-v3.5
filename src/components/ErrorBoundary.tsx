import React, { Component } from 'react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to console and external services
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // Store error info
    this.setState({
      error,
      errorInfo
    });

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-charcoal-dark to-charcoal-black flex items-center justify-center">
          <div className="glass-container max-w-md mx-4 p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-hunter-emerald to-metallic-silver rounded-full flex items-center justify-center">
                <svg 
                  className="w-8 h-8 text-charcoal-dark" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" 
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-glass-light mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-hunter-sage mb-6">
                We encountered an unexpected error. Don't worry, our team has been notified.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={this.handleRetry}
                className="w-full px-6 py-3 bg-gradient-to-r from-hunter-emerald to-hunter-core text-charcoal-dark font-semibold rounded-lg hover:shadow-lg hover:shadow-hunter-emerald/25 transition-all duration-300 transform hover:scale-105"
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 border-2 border-hunter-emerald text-hunter-emerald rounded-lg hover:bg-hunter-emerald hover:text-charcoal-dark transition-all duration-300"
              >
                Refresh Page
              </button>
            </div>

            {/* Error details for development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-hunter-sage cursor-pointer hover:text-glass-light">
                  Error Details (Development)
                </summary>
                <div className="mt-2 p-4 bg-charcoal-black rounded-lg border border-hunter-sage/20">
                  <pre className="text-xs text-red-400 whitespace-pre-wrap overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
