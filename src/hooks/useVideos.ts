import { useState, useEffect, useCallback } from 'react';
import { getVideos } from '../lib/api';
import type { Video, Category } from '../types';

export interface UseVideosOptions {
  featuredOnly?: boolean;
  category?: Category | 'All';
}

export function useVideos(opts: UseVideosOptions = {}) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getVideos(opts);
      setVideos(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [opts.featuredOnly, opts.category]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return { videos, loading, error, refetch: fetchVideos };
}
