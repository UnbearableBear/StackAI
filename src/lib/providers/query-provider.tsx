'use client';

import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  handleGetKBError,
  KNOWLEDGE_BASE_ERROR_KEY,
} from '@/hooks/queries/useKnowledgeBase';
import { clear } from 'console';
import { useKnowledgeBaseIdQueryParameter } from '@/hooks/useKnowledgeBaseIdQueryParameter';

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { clearKnowledgeBase } = useKnowledgeBaseIdQueryParameter();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            if (query.meta?.errorKey === KNOWLEDGE_BASE_ERROR_KEY) {
              handleGetKBError(query, error, clearKnowledgeBase);
              return;
            }
          },
        }),
        defaultOptions: {
          queries: {
            retry: false,
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
