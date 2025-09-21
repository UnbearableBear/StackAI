import { useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { Route } from 'next';

export const useKnowledgeBaseIdQueryParameter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const knowledgeBaseId = searchParams.get('kb');

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const removeQueryParam = useCallback(
    (name: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(name);
      return params.toString();
    },
    [searchParams]
  );

  const setKnowledgeBase = useCallback(
    (id: string) => {
      const queryString = createQueryString('kb', id);
      const url = `${pathname}?${queryString}` as Route;
      router.replace(url);
    },
    [createQueryString, pathname, router]
  );

  const clearKnowledgeBase = useCallback(() => {
    const queryString = removeQueryParam('kb');
    const url = (
      queryString ? `${pathname}?${queryString}` : pathname
    ) as Route;
    router.replace(url);
  }, [removeQueryParam, pathname, router]);

  return {
    knowledgeBaseId,
    setKnowledgeBase,
    clearKnowledgeBase,
  };
};
