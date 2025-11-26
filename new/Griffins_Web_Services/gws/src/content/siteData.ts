// src/siteData.ts - Compatible with both Astro and React
const siteDomain = import.meta.env.PUBLIC_SITE_DOMAIN;

export const siteData = {
  title: "Griffin's Web Services",
  legalName: "Griffin's Web Services LLC",
  description:
    "Fast, secure, professional websites for businesses that want a trustworthy online presence without technical headaches.",
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
