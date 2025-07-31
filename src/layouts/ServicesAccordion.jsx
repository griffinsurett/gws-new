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

  // Reset & autoplay when service changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setProgress(0);
    }
  }, [activeIndex]);

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
  };

  const handleEnded = () => {
    setProgress(100);
    setTimeout(() => {
      setActiveIndex((i) => (i + 1) % services.length);
    }, 500);
  };

  const toggleAccordion = (i) => {
    setActiveIndex((prev) => (prev === i ? -1 : i));
    setProgress(0);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Heading */}
      <div className="mb-8 text-center lg:text-left">
        <Heading className="text-3xl md:text-4xl font-bold text-heading">
          Our Services
        </Heading>
        <p className="text-lg text-text">
          Discover how we can help transform your business…
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Accordion list */}
        <div className="flex flex-col space-y-6">
          {services.map((service, i) => (
            <div key={i} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <button
                onClick={() => toggleAccordion(i)}
                className="w-full text-left flex items-center justify-between px-4 py-3"
              >
                <Heading tagName="h4" className="text-lg font-semibold text-heading">
                  {service.heading}
                </Heading>
                <Icon
                  icon={ChevronIcon}
                  className={`w-8 h-8 transition-transform duration-300 ${
                    activeIndex === i ? "rotate-180 text-primary" : "text-text"
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden px-4 ${
                  activeIndex === i ? "max-h-96 opacity-100 pt-4" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-text mb-4">{service.description}</p>

                {activeIndex === i && (
                  <div className="lg:hidden mb-4">
                    <video
                      ref={videoRef}
                      src={service.videoSrc}
                      autoPlay
                      muted
                      onTimeUpdate={handleTimeUpdate}
                      onEnded={handleEnded}
                      className="w-full h-48 object-cover rounded-lg bg-transparent"
                    />
                  </div>
                )}
              </div>

              {/* Divider / progress bar */}
              <div className="w-full bg-bg2 h-0.5 relative my-3">
                {activeIndex === i && (
                  <div
                    className="neon-background-primary h-0.5 rounded-full absolute left-0 top-0 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Desktop video */}
        <div className="hidden lg:block">
          <div className="sticky top-8">
            {activeIndex >= 0 ? (
              <video
                ref={videoRef}
                src={services[activeIndex].videoSrc}
                controls
                autoPlay
                muted
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                className="w-full h-96 object-cover rounded-xl shadow-2xl"
              />
            ) : (
              <div className="relative rounded-xl overflow-hidden bg-heading shadow-2xl h-96 flex items-center justify-center">
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