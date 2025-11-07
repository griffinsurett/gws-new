import React, { useState, useEffect, useRef } from "react";
import Icon from "@/components/Icon/Icon";
import EarRape from "@/assets/Black-Microwave-Earrape.mp4";
import Heading from "../components/Heading";

const ServicesAccordion = () => {
  const services = [
    { heading: "Web Development", description: "Custom websites and web applications built with modern technologies. We create responsive, fast, and user-friendly digital experiences that drive results for your business.", videoSrc: EarRape },
    { heading: "Mobile App Development", description: "Native and cross-platform mobile applications for iOS and Android. From concept to deployment, we build apps that engage users and grow your business.", videoSrc: EarRape },
    { heading: "Digital Marketing", description: "Comprehensive digital marketing strategies including SEO, social media, content marketing, and paid advertising to boost your online presence and drive conversions.", videoSrc: EarRape },
    { heading: "UI/UX Design", description: "User-centered design solutions that combine aesthetics with functionality. We create intuitive interfaces that provide exceptional user experiences across all devices.", videoSrc: EarRape },
    { heading: "E-commerce Solutions", description: "Complete e-commerce platforms that drive sales and enhance customer experiences. From shopping carts to payment processing, we handle it all.", videoSrc: EarRape },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  // Reset & autoplay whenever the active panel changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setProgress(0);
    }
  }, [activeIndex]);

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v?.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
  };

  const handleEnded = () => {
    setProgress(100);
    setTimeout(
      () => setActiveIndex((i) => (i + 1) % services.length),
      500
    );
  };

  const toggleAccordion = (i) => {
    setActiveIndex((prev) => (prev === i ? -1 : i));
    setProgress(0);
  };

  return (
    <div className="w-full mx-auto">
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
        {/* Left: Accordion list */}
        <div className="flex flex-col">
          {services.map((service, i) => (
            <AccordionItem
              key={i}
              service={service}
              isActive={activeIndex === i}
              progress={progress}
              onToggle={() => toggleAccordion(i)}
              videoRef={videoRef}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
            />
          ))}
        </div>

        {/* Right: Desktop video */}
        <div className="hidden lg:block">
          <div className="sticky top-8">
            {activeIndex >= 0 ? (
              <VideoPlayer
                ref={videoRef}
                src={services[activeIndex].videoSrc}
                className="load scale-up"
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                desktop
              />
            ) : (
              <div className="relative rounded-xl overflow-hidden bg-heading h-96 flex items-center justify-center">
                <p className="text-text text-lg font-medium">
                  Select a service to view
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const progressBarClass = "h-0.5";

// ── AccordionItem ─────────────────────────────────────────────────
const AccordionItem = ({
  service,
  isActive,
  progress,
  onToggle,
  videoRef,
  onTimeUpdate,
  onEnded,
}) => (
  <div className="accordion-item load scale-up">
  <div className="overflow-hidden transition-shadow duration-300">
    <button
      onClick={onToggle}
      className="w-full text-left flex items-center justify-between cursor-pointer"
    >
      <Heading tagName="h3" className="py-4">
        {service.heading}
      </Heading>
      <Icon
        icon={ChevronIcon}
        className={`w-8 h-8 transition-transform duration-300 ${
          isActive ? "rotate-180 text-primary" : "text-bg3"
        }`}
      />
    </button>

    <div
      className={`transition-all duration-500 ease-in-out overflow-hidden ${
        isActive ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <p className="text-text small-text m-0 py-4">{service.description}</p>
      <div className="lg:hidden">
        <VideoPlayer
          ref={videoRef}
          src={service.videoSrc}
          onTimeUpdate={onTimeUpdate}
          onEnded={onEnded}
        />
      </div>
    </div>

    <DividerProgress isActive={isActive} progress={progress} />
  </div>
  </div>
);

// ── DividerProgress ────────────────────────────────────────────────
const DividerProgress = ({ isActive, progress }) => (
  <div className={`${progressBarClass} bg-bg3 relative my-3`}>
    {isActive && (
      <div
        className={`${progressBarClass} neon-background-primary rounded-full absolute left-0 top-0 transition-all duration-300`}
        style={{ width: `${progress}%` }}
      />
    )}
  </div>
);

// ── VideoPlayer ────────────────────────────────────────────────────
const VideoPlayer = React.forwardRef(
  ({ src, onTimeUpdate, onEnded, desktop = false, className }, ref) => (
    <video
      ref={ref}
      src={src}
      controls={desktop}
      autoPlay
      muted
      playsInline
      onTimeUpdate={onTimeUpdate}
      onEnded={onEnded}
      className={`${className} ${
        desktop
          ? "w-full h-96 object-cover"
          : "w-full h-48 object-cover bg-transparent"
      }`}
    />
  )
);

// ── ChevronIcon ────────────────────────────────────────────────────
const ChevronIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

export default ServicesAccordion;