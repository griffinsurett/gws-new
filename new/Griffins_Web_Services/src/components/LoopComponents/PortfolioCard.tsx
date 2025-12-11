// src/components/LoopComponents/PortfolioCard.tsx
import type { MouseEventHandler } from "react";
import { getImageSrc } from "@/layouts/collections/helpers/layoutHelpers";

export interface PortfolioItemData {
  slug?: string;
  title: string;
  description?: string;
  featuredImage?: any;
  bannerImage?: any;
  client?: string;
  category?: string;
  technologies?: string[];
  projectUrl?: string;
  url?: string;
}

interface PortfolioCardProps {
  item: PortfolioItemData;
  isActive?: boolean;
  onSelect?: MouseEventHandler<HTMLDivElement>;
}

export default function PortfolioCard({
  item,
  isActive = false,
  onSelect,
}: PortfolioCardProps) {
  const {
    title,
    description,
    category,
    client,
    technologies = [],
  } = item;

  const imageSrc =
    getImageSrc(item.featuredImage) ||
    getImageSrc(item.bannerImage) ||
    "";

  const link = item.projectUrl || item.url;

  return (
    <div
      className={[
        "snap-center shrink-0 w-[90vw] sm:w-[510px] lg:w-[640px]",
        "bg-bg rounded-3xl border border-white/10 shadow-[0_25px_65px_-25px_rgba(15,15,35,0.9)]",
        "transition-all duration-500 ease-out hover:border-accent/40",
        isActive ? "ring-2 ring-accent shadow-accent/20" : "ring-1 ring-white/5",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onSelect}
    >
      <div className="relative overflow-hidden rounded-t-3xl h-64 bg-gradient-to-br from-bg2 to-bg">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-text/60 text-sm uppercase tracking-[0.2em]">
            Preview coming soon
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          {category && (
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70 mb-2">
              {category}
            </p>
          )}
          <h3 className="text-2xl font-semibold leading-tight">{title}</h3>
          {client && (
            <p className="text-sm text-white/70 mt-1">Client: {client}</p>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        {description && (
          <p className="text-text/90 leading-relaxed">{description}</p>
        )}

        {technologies.length > 0 && (
          <ul className="flex flex-wrap gap-2 text-xs text-accent">
            {technologies.map((tech) => (
              <li
                key={`${item.slug ?? title}-${tech}`}
                className="px-3 py-1 rounded-full border border-accent/30 bg-accent/5"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
          >
            View Project
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
