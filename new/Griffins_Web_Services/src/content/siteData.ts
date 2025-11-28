// src/siteData.ts - Compatible with both Astro and React
const siteDomain = import.meta.env.PUBLIC_SITE_DOMAIN;

export const siteData = {
  title: "Griffin's Web Services",
  legalName: "Griffin's Web Services LLC",
  description:
    "Every great business deserves a powerful online presence. We create websites that do more than just exist — they load instantly, showcase your brand, engage visitors, and grow alongside your business. We don’t just design your site — we make it lightning-fast, manage it, and protect it for the long term.",
  domain: siteDomain,
  url: `https://${siteDomain}`,
  location: "Freehold, New Jersey, United States",
  address: null,
  tagline: "Get a website your business can be proud of — fast, secure, and built to last.",
};

export const ctaData = {
  text: "Schedule a Consultation",
  link: "/contact-us",
};
