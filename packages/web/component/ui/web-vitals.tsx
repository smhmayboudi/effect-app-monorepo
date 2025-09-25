"use client";

import { useReportWebVitals } from "next/web-vitals";
import type { Metric } from "web-vitals";

// Define the metric handler function type
type MetricHandler = (metric: Metric) => void;

// Define the component props interface
interface WebVitalsProps {
  onMetricReport?: MetricHandler;
  enabled?: boolean;
}

export function WebVitals({ onMetricReport, enabled = true }: WebVitalsProps) {
  const handleMetric: MetricHandler = (metric) => {
    // Call the custom handler if provided
    onMetricReport?.(metric);

    // Default metric handling
    switch (metric.name) {
      case "TTFB": {
        console.debug("Time to First Byte (TTFB):", metric.value, metric);
        // You can send this to your analytics service
        sendToAnalytics(metric);
        break;
      }
      case "FCP": {
        console.debug("First Contentful Paint (FCP):", metric.value, metric);
        sendToAnalytics(metric);
        break;
      }
      case "LCP": {
        console.debug("Largest Contentful Paint (LCP):", metric.value, metric);
        sendToAnalytics(metric);
        break;
      }
      // case "FID": {
      //   console.debug("First Input Delay (FID):", metric.value, metric);
      //   sendToAnalytics(metric);
      //   break;
      // }
      case "CLS": {
        console.debug("Cumulative Layout Shift (CLS):", metric.value, metric);
        sendToAnalytics(metric);
        break;
      }
      case "INP": {
        console.debug("Interaction to Next Paint (INP):", metric.value, metric);
        sendToAnalytics(metric);
        break;
      }
      default: {
        console.debug("First Input Delay (FID):", metric.value, metric);
        sendToAnalytics(metric);
        break;
      }
    }
  };

  // Function to send metrics to your analytics service
  const sendToAnalytics = (metric: Metric) => {
    // Example: Send to your analytics backend
    const body = JSON.stringify(metric);

    // Using navigator.sendBeacon for reliable sending
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/web-vitals", body);
    } else {
      fetch("/api/web-vitals", {
        body,
        method: "POST",
        keepalive: true,
      });
    }
  };

  // Conditionally enable web vitals reporting
  useReportWebVitals(enabled ? handleMetric : () => {});

  return null; // This component doesn't render anything
}
