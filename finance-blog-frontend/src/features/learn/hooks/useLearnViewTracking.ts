// src/features/learn/hooks/useLearnViewTracking.ts

import { useEffect, useRef } from 'react';
import { recordProductView, recordEngagedView } from '../services/learn.view.service';

const ENGAGED_THRESHOLD = 15000; // 15 seconds

interface UseLearnViewTrackingOptions {
  categorySlug?: string;
  productSlug?: string;
  subAnchorId?: string;
  enabled?: boolean;
}

export const useLearnViewTracking = ({
  categorySlug,
  productSlug,
  subAnchorId,
  enabled = true,
}: UseLearnViewTrackingOptions) => {
  const hasRecordedView = useRef(false);
  const hasRecordedEngaged = useRef(false);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled || !categorySlug || !productSlug) return;

    // Record view on mount
    if (!hasRecordedView.current) {
      recordProductView(categorySlug, productSlug, subAnchorId).then((result) => {
        if (result.recorded) {
          hasRecordedView.current = true;
          startTimeRef.current = Date.now();
        }
      });
    }

    // Record engaged view after threshold
    const timer = setTimeout(() => {
      if (!hasRecordedEngaged.current && hasRecordedView.current) {
        recordEngagedView(categorySlug, productSlug, subAnchorId).then((result) => {
          if (result.recorded) {
            hasRecordedEngaged.current = true;
          }
        });
      }
    }, ENGAGED_THRESHOLD);

    return () => {
      clearTimeout(timer);
    };
  }, [categorySlug, productSlug, subAnchorId, enabled]);

  // Track page visibility to pause/resume timer
  useEffect(() => {
    if (!enabled || !categorySlug || !productSlug) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page hidden - could pause tracking if needed
      } else {
        // Page visible - could resume tracking if needed
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [categorySlug, productSlug, enabled]);
};