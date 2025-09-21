import type { Metadata } from 'next';
import AuthProvider from '@/components/AuthProvider';
import QueryProvider from '@/lib/providers/query-provider';
import { SelectionProvider } from '@/contexts/SelectionContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'StackAI Google Drive Picker',
  description: 'A custom file picker for Google Drive connections',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorBoundary>
          <AuthProvider>
            <QueryProvider>
              <SelectionProvider>{children}</SelectionProvider>
              <Toaster position="top-center" />
            </QueryProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
