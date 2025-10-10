"use client";

import { useReportWebVitals } from "next/web-vitals";
import * as React from "react";
import type { Metric } from "web-vitals";

interface UseWebVitalsOptions {
  onMetricReport?: (metric: Metric) => void;
  enabled?: boolean;
  analyticsEndpoint?: string;
}

export function useWebVitals({
  onMetricReport,
  enabled = true,
  analyticsEndpoint = "/api/web-vitals",
}: UseWebVitalsOptions = {}) {
  const analyticsEndpointRef = React.useRef(analyticsEndpoint);

  React.useEffect(() => {
    analyticsEndpointRef.current = analyticsEndpoint;
  }, [analyticsEndpoint]);

  const handleMetric = (metric: Metric) => {
    // Call custom handler
    onMetricReport?.(metric);

    // Send to analytics
    sendToAnalytics(metric, analyticsEndpointRef.current);
  };

  useReportWebVitals(enabled ? handleMetric : () => {});
}

// Utility function to send metrics to analytics
function sendToAnalytics(metric: Metric, endpoint: string) {
  const body = JSON.stringify({
    ...metric,
    // Add additional context
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, body);
  } else {
    fetch(endpoint, {
      body,
      method: "POST",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((error) => {
      console.error("Failed to send web vitals:", error);
    });
  }
}
