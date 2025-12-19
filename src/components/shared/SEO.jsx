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
}) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export { SEO };
