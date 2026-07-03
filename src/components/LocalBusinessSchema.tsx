import { cafeConfig } from "@/config/cafe.config";

export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: cafeConfig.name,
    image: cafeConfig.seo.defaultImage,
    "@id": cafeConfig.seo.siteUrl,
    url: cafeConfig.seo.siteUrl,
    telephone: cafeConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: cafeConfig.address,
      addressLocality: cafeConfig.city,
      postalCode: cafeConfig.postalCode,
      addressRegion: cafeConfig.region,
      addressCountry: cafeConfig.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 22.5574,
      longitude: 88.3512,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "08:00",
        closes: "21:30",
      },
    ],
    servesCuisine: ["Coffee", "Healthy", "Gluten-Free", "Vegan"],
    priceRange: "₹₹",
    hasMap: "https://maps.google.com/?q=Chowringhee+Mansion+Kolkata",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
