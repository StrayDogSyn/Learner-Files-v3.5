import { DatabaseError } from './utils';

// Error types for different services
export enum ErrorType {
  DATABASE_ERROR = 'DATABASE_ERROR',
  AI_SERVICE_ERROR = 'AI_SERVICE_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR'
}

// Severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Enhanced error interface
export interface ServiceError {
  type: ErrorType;
  message: string;
  code?: string;
  severity: ErrorSeverity;
  timestamp: Date;
  context?: Record<string, any>;
  stack?: string;
  retryable?: boolean;
  userMessage?: string;
}

// Error handler class
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: ServiceError[] = [];
  private maxLogSize = 1000;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Handle database errors
  handleDatabaseError(error: any, context?: Record<string, any>): ServiceError {
    const serviceError: ServiceError = {
      type: ErrorType.DATABASE_ERROR,
      message: this.extractErrorMessage(error),
      code: error.code || 'DB_UNKNOWN',
      severity: this.determineSeverity(error),
      timestamp: new Date(),
      context,
      stack: error.stack,
      retryable: this.isRetryable(error),
      userMessage: this.generateUserMessage(ErrorType.DATABASE_ERROR, error)
    };

    this.logError(serviceError);
    return serviceError;
  }

  // Handle AI service errors
  handleAIServiceError(error: any, context?: Record<string, any>): ServiceError {
    const serviceError: ServiceError = {
      type: ErrorType.AI_SERVICE_ERROR,
      message: this.extractErrorMessage(error),
      code: this.extractAIErrorCode(error),
      severity: this.determineAISeverity(error),
      timestamp: new Date(),
      context,
      stack: error.stack,
      retryable: this.isAIRetryable(error),
      userMessage: this.generateUserMessage(ErrorType.AI_SERVICE_ERROR, error)
    };

    this.logError(serviceError);
    return serviceError;
  }

  // Handle authentication errors
  handleAuthError(error: any, context?: Record<string, any>): ServiceError {
    const serviceError: ServiceError = {
      type: ErrorType.AUTHENTICATION_ERROR,
      message: this.extractErrorMessage(error),
      code: error.code || 'AUTH_UNKNOWN',
      severity: ErrorSeverity.HIGH,
      timestamp: new Date(),
      context,
      stack: error.stack,
      retryable: false,
      userMessage: 'Authentication failed. Please check your credentials and try again.'
    };

    this.logError(serviceError);
    return serviceError;
  }

  // Handle rate limit errors
  handleRateLimitError(error: any, context?: Record<string, any>): ServiceError {
    const serviceError: ServiceError = {
      type: ErrorType.RATE_LIMIT_ERROR,
      message: this.extractErrorMessage(error),
      code: 'RATE_LIMIT_EXCEEDED',
      severity: ErrorSeverity.MEDIUM,
      timestamp: new Date(),
      context,
      retryable: true,
      userMessage: 'Rate limit exceeded. Please wait a moment before trying again.'
    };

    this.logError(serviceError);
    return serviceError;
  }

  // Handle validation errors
  handleValidationError(error: any, context?: Record<string, any>): ServiceError {
    const serviceError: ServiceError = {
      type: ErrorType.VALIDATION_ERROR,
      message: this.extractErrorMessage(error),
      code: 'VALIDATION_FAILED',
      severity: ErrorSeverity.LOW,
      timestamp: new Date(),
      context,
      retryable: false,
      userMessage: 'Invalid input provided. Please check your data and try again.'
    };

    this.logError(serviceError);
    return serviceError;
  }

  // Generic error handler
  handleError(error: any, type: ErrorType, context?: Record<string, any>): ServiceError {
    switch (type) {
      case ErrorType.DATABASE_ERROR:
        return this.handleDatabaseError(error, context);
      case ErrorType.AI_SERVICE_ERROR:
        return this.handleAIServiceError(error, context);
      case ErrorType.AUTHENTICATION_ERROR:
        return this.handleAuthError(error, context);
      case ErrorType.RATE_LIMIT_ERROR:
        return this.handleRateLimitError(error, context);
      case ErrorType.VALIDATION_ERROR:
        return this.handleValidationError(error, context);
      default:
        return this.handleGenericError(error, context);
    }
  }

  // Handle generic errors
  private handleGenericError(error: any, context?: Record<string, any>): ServiceError {
    const serviceError: ServiceError = {
      type: ErrorType.NETWORK_ERROR,
      message: this.extractErrorMessage(error),
      code: 'GENERIC_ERROR',
      severity: ErrorSeverity.MEDIUM,
      timestamp: new Date(),
      context,
      stack: error.stack,
      retryable: true,
      userMessage: 'An unexpected error occurred. Please try again.'
    };

    this.logError(serviceError);
    return serviceError;
  }

  // Extract error message
  private extractErrorMessage(error: any): string {
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    if (error?.message) return error.message;
    if (error?.error?.message) return error.error.message;
    return 'Unknown error occurred';
  }

  // Extract AI-specific error codes
  private extractAIErrorCode(error: any): string {
    if (error?.status) return `AI_HTTP_${error.status}`;
    if (error?.code) return error.code;
    if (error?.type) return error.type;
    return 'AI_UNKNOWN';
  }

  // Determine error severity
  private determineSeverity(error: any): ErrorSeverity {
    if (error?.code === 'PGRST301') return ErrorSeverity.CRITICAL; // Row level security
    if (error?.code?.startsWith('23')) return ErrorSeverity.HIGH; // Integrity constraint
    if (error?.code === 'PGRST116') return ErrorSeverity.LOW; // Not found
    return ErrorSeverity.MEDIUM;
  }

  // Determine AI error severity
  private determineAISeverity(error: any): ErrorSeverity {
    if (error?.status === 401) return ErrorSeverity.CRITICAL; // Unauthorized
    if (error?.status === 429) return ErrorSeverity.MEDIUM; // Rate limit
    if (error?.status >= 500) return ErrorSeverity.HIGH; // Server error
    return ErrorSeverity.MEDIUM;
  }

  // Check if error is retryable
  private isRetryable(error: any): boolean {
    const retryableCodes = ['PGRST001', 'PGRST301', '08000', '08003', '08006'];
    return retryableCodes.includes(error?.code) || error?.status >= 500;
  }

  // Check if AI error is retryable
  private isAIRetryable(error: any): boolean {
    const retryableStatuses = [429, 500, 502, 503, 504];
    return retryableStatuses.includes(error?.status);
  }

  // Generate user-friendly messages
  private generateUserMessage(type: ErrorType, error: any): string {
    switch (type) {
      case ErrorType.DATABASE_ERROR:
        if (error?.code === 'PGRST116') return 'The requested data was not found.';
        if (error?.code === 'PGRST301') return 'You do not have permission to access this data.';
        return 'A database error occurred. Please try again later.';
      
      case ErrorType.AI_SERVICE_ERROR:
        if (error?.status === 401) return 'AI service authentication failed. Please check your API key.';
        if (error?.status === 429) return 'AI service rate limit exceeded. Please wait before trying again.';
        if (error?.status >= 500) return 'AI service is temporarily unavailable. Please try again later.';
        return 'AI service error occurred. Please try again.';
      
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  // Log error
  private logError(error: ServiceError): void {
    this.errorLog.push(error);
    
    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize / 2);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${error.type}] ${error.message}`, {
        code: error.code,
        severity: error.severity,
        context: error.context
      });
    }
  }

  // Get error statistics
  getErrorStats(): {
    total: number;
    byType: Record<ErrorType, number>;
    bySeverity: Record<ErrorSeverity, number>;
    recent: ServiceError[];
  } {
    const byType = {} as Record<ErrorType, number>;
    const bySeverity = {} as Record<ErrorSeverity, number>;

    this.errorLog.forEach(error => {
      byType[error.type] = (byType[error.type] || 0) + 1;
      bySeverity[error.severity] = (bySeverity[error.severity] || 0) + 1;
    });

    return {
      total: this.errorLog.length,
      byType,
      bySeverity,
      recent: this.errorLog.slice(-10)
    };
  }

  // Clear error log
  clearErrorLog(): void {
    this.errorLog = [];
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Utility functions for common error scenarios
export function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorType: ErrorType,
  context?: Record<string, any>
): Promise<T> {
  return operation().catch(error => {
    const serviceError = errorHandler.handleError(error, errorType, context);
    throw new DatabaseError(serviceError.userMessage || serviceError.message, serviceError.code, serviceError.context);
  });
}

export function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  errorType: ErrorType = ErrorType.NETWORK_ERROR
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation();
        resolve(result);
        return;
      } catch (error) {
        const serviceError = errorHandler.handleError(error, errorType, { attempt, maxRetries });
        
        if (!serviceError.retryable || attempt === maxRetries) {
          reject(new DatabaseError(serviceError.userMessage || serviceError.message, serviceError.code, serviceError.context));
          return;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  });
}