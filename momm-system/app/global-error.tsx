'use client';

// Global error boundary for the app directory. Keeps things simple and avoids client hooks beyond React basics.

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 max-w-lg w-full text-center space-y-4">
            <div className="text-2xl font-bold">Something went wrong</div>
            <div className="text-gray-600 text-sm break-words">
              {error?.message || 'An unexpected error occurred.'}
            </div>
            <button
              onClick={reset}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
