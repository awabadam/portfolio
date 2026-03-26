"use client";

import React from "react";

type ElementType = "blob" | "dots" | "lines" | "gradient";
type ElementPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center";

interface VisualElementProps {
  type: ElementType;
  position: ElementPosition;
  color?: string;
  size?: "small" | "medium" | "large";
  opacity?: number;
  className?: string;
}

const VisualElement: React.FC<VisualElementProps> = ({
  type,
  position,
  color = "primary",
  size = "medium",
  opacity = 0.1,
  className = "",
}) => {
  // Get position classes
  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-0 left-0";
      case "top-right":
        return "top-0 right-0";
      case "bottom-left":
        return "bottom-0 left-0";
      case "bottom-right":
        return "bottom-0 right-0";
      case "center":
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
      default:
        return "top-0 left-0";
    }
  };

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "h-40 w-40";
      case "medium":
        return "h-80 w-80";
      case "large":
        return "h-120 w-120";
      default:
        return "h-80 w-80";
    }
  };

  // Render different element types
  const renderElement = () => {
    switch (type) {
      case "blob":
        return (
          <div
            className={`absolute ${getPositionClasses()} ${getSizeClasses()} rounded-full bg-${color}/${opacity} blur-3xl ${className}`}
          ></div>
        );
      case "dots":
        return (
          <div
            className={`absolute ${getPositionClasses()} ${getSizeClasses()} opacity-${
              opacity * 100
            } ${className}`}
            style={{
              backgroundImage: `radial-gradient(circle, var(--${color}) 1px, transparent 1px)`,
              backgroundSize: "15px 15px",
            }}
          ></div>
        );
      case "lines":
        return (
          <div
            className={`absolute ${getPositionClasses()} ${getSizeClasses()} opacity-${
              opacity * 100
            } ${className}`}
            style={{
              backgroundImage: `linear-gradient(to right, var(--${color}) 1px, transparent 1px), linear-gradient(to bottom, var(--${color}) 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          ></div>
        );
      case "gradient":
        return (
          <div
            className={`absolute ${getPositionClasses()} ${getSizeClasses()} bg-gradient-to-br from-${color}/${
              opacity * 0.5
            } to-${color}/${opacity} ${className}`}
          ></div>
        );
      default:
        return null;
    }
  };

  return renderElement();
};

export default VisualElement;
