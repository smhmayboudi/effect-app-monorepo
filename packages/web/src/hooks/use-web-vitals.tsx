"use client";

import type { Metric } from "web-vitals";

import { useReportWebVitals } from "next/web-vitals";
import * as React from "react";

interface UseWebVitalsOptions {
  analyticsEndpoint?: string;
  enabled?: boolean;
  onMetricReport?: (metric: Metric) => void;
}

export function useWebVitals({
  analyticsEndpoint = "/api/web-vitals",
  enabled = true,
  onMetricReport,
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
    timestamp: new Date().toISOString(),
    // Add additional context
    url: window.location.href,
    userAgent: navigator.userAgent,
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, body);
  } else {
    fetch(endpoint, {
      body,
      headers: {
        "Content-Type": "application/json",
      },
      keepalive: true,
      method: "POST",
    }).catch((error) => {
      console.error("Failed to send web vitals:", error);
    });
  }
}
