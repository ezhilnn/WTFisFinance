// src/features/views/hooks/useViewTracking.ts

import { useEffect, useRef } from 'react';
import { recordView, recordEngagedRead } from './view.service';

const ENGAGED_READ_THRESHOLD = 15000; // 15 seconds

interface UseViewTrackingOptions {
  blogId: string;
  enabled?: boolean;
}

export const useViewTracking = ({ blogId, enabled = true }: UseViewTrackingOptions) => {
  const hasRecordedView = useRef(false);
  const hasRecordedEngaged = useRef(false);
  const startTimeRef = useRef<number>(0);


  useEffect(() => {
    if (!enabled || !blogId) return;

    // Record view on mount
    if (!hasRecordedView.current) {
      recordView(blogId).then((result) => {
        if (result.recorded) {
          hasRecordedView.current = true;
          startTimeRef.current = Date.now();
        }
      });
    }

    // Record engaged read after threshold
    const timer = setTimeout(() => {
      if (!hasRecordedEngaged.current && hasRecordedView.current) {
        recordEngagedRead(blogId).then((result) => {
          if (result.recorded) {
            hasRecordedEngaged.current = true;
          }
        });
      }
    }, ENGAGED_READ_THRESHOLD);

    return () => {
      clearTimeout(timer);
    };
  }, [blogId, enabled]);

  // Optional: Track page visibility to pause/resume timer
  useEffect(() => {
    if (!enabled || !blogId) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page hidden - pause tracking
      } else {
        // Page visible - resume tracking
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [blogId, enabled]);
};