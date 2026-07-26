import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
 children: ReactNode;
 fallback?: ReactNode;
}

interface State {
 hasError: boolean;
 error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
 public state: State = {
 hasError: false,
 error: null
 };

 public static getDerivedStateFromError(error: Error): State {
 return { hasError: true, error };
 }

 public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
 console.error('Uncaught error:', error, errorInfo);
 }

 public render() {
 if (this.state.hasError) {
 if (this.props.fallback) {
 return this.props.fallback;
 }

 return (
 <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
 <div className="max-w-md w-full text-center">
 <div className="w-20 h-20 bg-red-100 flex items-center justify-center mx-auto mb-6">
 <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
 </svg>
 </div>
 <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
 <p className="text-gray-600 mb-6">
 We're sorry, but something unexpected happened. Please try refreshing the page or go back to the home page.
 </p>
 <div className="flex gap-4 justify-center">
 <button
 onClick={() => window.location.reload()}
 className="px-6 py-3 bg-[#1E1E1E] text-white font-semibold hover:bg-[#1E1E1E]/90 transition"
 >
 Refresh Page
 </button>
 <a
 href="/"
 className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 transition"
 >
 Go Home
 </a>
 </div>
 {import.meta.env.DEV && this.state.error && (
 <div className="mt-8 text-left">
 <details className="bg-gray-100 p-4">
 <summary className="cursor-pointer font-medium text-gray-700">Error Details (Development Only)</summary>
 <pre className="mt-2 text-sm text-red-600 overflow-auto">
 {this.state.error.toString()}
 </pre>
 </details>
 </div>
 )}
 </div>
 </div>
 );
 }

 return this.props.children;
 }
}
