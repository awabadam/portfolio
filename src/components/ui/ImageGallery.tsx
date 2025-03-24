"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Button } from "./button";

interface ImageGalleryProps {
  images: string[];
  className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images = [],
  className = "",
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  // If no images, show a placeholder
  if (images.length === 0) {
    return (
      <div className={`w-full rounded-lg bg-muted/30 ${className}`}>
        <div className="flex aspect-video w-full items-center justify-center">
          <p className="text-muted-foreground">No images available</p>
        </div>
      </div>
    );
  }

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const toggleLightbox = () => {
    setShowLightbox((prev) => !prev);
  };

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Main Image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <Image
          src={images[activeIndex]}
          alt={`Project image ${activeIndex + 1}`}
          fill
          className="object-cover"
        />

        {/* Navigation Buttons */}
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-background/50 backdrop-blur-sm"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-background/50 backdrop-blur-sm"
            onClick={handleNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Expand Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 rounded-full bg-background/50 backdrop-blur-sm"
          onClick={toggleLightbox}
        >
          <Maximize2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            className={`relative aspect-video overflow-hidden rounded-md transition-all hover:opacity-90 ${
              index === activeIndex ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setActiveIndex(index)}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="relative h-[80vh] w-[80vw]">
            <Image
              src={images[activeIndex]}
              alt={`Project image ${activeIndex + 1}`}
              fill
              className="object-contain"
            />

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 rounded-full bg-background/50 backdrop-blur-sm"
              onClick={toggleLightbox}
            >
              <Maximize2 className="h-5 w-5" />
            </Button>

            <div className="absolute inset-0 flex items-center justify-between p-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-background/50 backdrop-blur-sm"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-background/50 backdrop-blur-sm"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
