export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: "Motherland Cafe",
    description:
      "A premium artisanal cafe in Kolkata offering coffee, healthy food, gluten-free options, and a calm work-friendly atmosphere.",
    url: "https://motherlandcafe.in",
    telephone: "+919748077790",
    address: {
      "@type": "PostalAddress",
      streetAddress: "A/3 Kyd Street, Chowringhee Mansion",
      addressLocality: "Kolkata",
      addressRegion: "West Bengal",
      postalCode: "700016",
      addressCountry: "IN",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",
        ],
        opens: "08:00",
        closes: "21:30",
      },
    ],
    servesCuisine: ["Coffee", "Healthy Food", "Gluten-Free", "Vegan"],
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
