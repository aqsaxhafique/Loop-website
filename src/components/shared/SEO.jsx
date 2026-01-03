import { Helmet } from "react-helmet";

const SEO = ({
  title = "Loop - Handcrafted Pancakes & Treats",
  description = "Loop makes handcrafted pancakes, waffles and savory treats — fresh, small-batch, and delivered fast. Order online for pickup or delivery.",
  keywords = "pancakes, waffles, bakery, handcrafted, breakfast delivery, desserts, Loop",
  canonical = window.location.href,
  ogImage = "",
  ogType = "website",
  twitterCard = "summary_large_image",
  structuredData = null,
  author = "Loop",
  robots = "index, follow",
}) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />
      
      {/* Canonical URL - Critical for avoiding duplicate content */}
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph / Facebook - Enhanced for better social sharing */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="Loop" />
      <meta property="og:locale" content="en_US" />
      {ogImage && (
        <>
          <meta property="og:image" content={ogImage} />
          <meta property="og:image:secure_url" content={ogImage} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content={title} />
        </>
      )}
      
      {/* Twitter Cards - Enhanced for better Twitter sharing */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:site" content="@Loop" />
      <meta name="twitter:creator" content="@Loop" />
      {ogImage && (
        <>
          <meta name="twitter:image" content={ogImage} />
          <meta name="twitter:image:alt" content={title} />
        </>
      )}
      
      {/* Mobile Web App Meta Tags */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Loop" />
      
      {/* Structured Data (JSON-LD) - Critical for rich snippets */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export { SEO };
