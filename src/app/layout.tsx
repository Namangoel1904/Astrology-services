import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";

const GTM_ID = "GTM-M34T7L2X";
const GA_MEASUREMENT_ID = "G-Y61HQXKZKW";

// Get the base URL for Open Graph images
function getBaseUrl() {
  // Check for explicit site URL
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  // Vercel provides VERCEL_URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Fallback for local development
  return "https://drjyotijoshi.com";
}

const baseUrl = getBaseUrl();
const ogImageUrl = "https://drjyotijoshi.com/wp-content/uploads/2025/12/Screenshot-2025-12-05-110428.png";

export const metadata: Metadata = {
  title: "ज्योतिष परामर्श | Dr. Jyoti Joshi",
  description:
    "विश्वसनीय वैदिक ज्योतिष परामर्श, अनुभवी महिला ज्योतिषियों के साथ ऑनलाइन स्लॉट बुक करें, Razorpay भुगतान व ईमेल पुष्टि के साथ.",
  openGraph: {
    title: "ज्योतिष परामर्श | Dr. Jyoti Joshi",
    description:
      "विश्वसनीय वैदिक ज्योतिष परामर्श, अनुभवी महिला ज्योतिषियों के साथ ऑनलाइन स्लॉट बुक करें, Razorpay भुगतान व ईमेल पुष्टि के साथ.",
    url: baseUrl,
    siteName: "Dr. Jyoti Joshi - ज्योतिष परामर्श",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "ज्योतिष परामर्श - Dr. Jyoti Joshi",
      },
    ],
    locale: "mr_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ज्योतिष परामर्श | Dr. Jyoti Joshi",
    description:
      "विश्वसनीय वैदिक ज्योतिष परामर्श, अनुभवी महिला ज्योतिषियों के साथ ऑनलाइन स्लॉट बुक करें, Razorpay भुगतान व ईमेल पुष्टि के साथ.",
    images: [ogImageUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mr" suppressHydrationWarning>
      <head>
        {/* Google Analytics (gtag.js) */}
        <Script
          id="ga-loader"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
        </Script>
        <Script id="gtm-base" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </head>
      <body className="antialiased">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        {children}
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
