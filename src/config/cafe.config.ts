export const cafeConfig = {
  name: "Motherland Cafe",
  tagline: "Escape the Noise. Sip Slowly.",
  address: "A/3 Kyd Street, Chowringhee Mansion",
  city: "Kolkata",
  postalCode: "700016",
  region: "West Bengal",
  country: "IN",
  googleMapsUrl: "https://maps.google.com/?q=Chowringhee+Mansion+Kolkata",
  phone: "+91 97480 77790",
  email: {
    hello: "hello@motherlandcafe.in",
    reservations: "reservations@motherlandcafe.in",
  },
  openingHours: "Mo-Su 08:00-21:30", // ISO 8601 format for schema
  openingHoursDisplay: "Every Day • 8:00 AM – 9:30 PM",
  socials: {
    instagram: "https://instagram.com/motherland.studios.cafe",
    whatsapp: "https://wa.me/919748077790",
    zomato: "https://www.zomato.com/kolkata/motherland-studio-cafe-chowringhee",
    swiggy: "https://www.swiggy.com/restaurants/827631/dineout",
  },
  seo: {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://motherlandcafe.in",
    defaultImage: "https://motherlandcafe.in/og-image.jpg",
  }
};
