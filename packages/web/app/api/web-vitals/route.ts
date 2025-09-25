import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Here you can process the web vitals data
    console.log("Web Vitals received:", body);

    // Send to your analytics service (Google Analytics, etc.)
    // await sendToGoogleAnalytics(body);

    // Or store in your database
    // await storeInDatabase(body);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error processing web vitals:", error);
    return NextResponse.json(
      { error: "Failed to process web vitals" },
      { status: 500 }
    );
  }
}

// Example function to send to Google Analytics
// async function sendToGoogleAnalytics(metric: any) {
//   // Implementation depends on your analytics setup
//   const { name, value } = metric;

//   // Using gtag.js
//   if (typeof window !== "undefined" && (window as any).gtag) {
//     (window as any).gtag("event", name, {
//       event_category: "Web Vitals",
//       value: Math.round(name === "CLS" ? value * 1000 : value),
//       non_interaction: true,
//     });
//   }
// }
