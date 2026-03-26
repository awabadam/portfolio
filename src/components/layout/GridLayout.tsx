"use client";

import React from "react";

interface GridLayoutProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: "gap-2" | "gap-4" | "gap-6" | "gap-8" | "gap-12";
  className?: string;
  itemClassName?: string;
}

const GridLayout: React.FC<GridLayoutProps> = ({
  children,
  columns = 3,
  gap = "gap-6",
  className = "",
  itemClassName = "",
}) => {
  // Create responsive column classes based on the columns prop
  const getColumnClasses = () => {
    switch (columns) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
  };

  // If children is an array, wrap each child in a div with the itemClassName
  const renderChildren = () => {
    if (!React.Children.count(children)) return null;

    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;

      return <div className={itemClassName}>{child}</div>;
    });
  };

  return (
    <div className={`grid w-full ${getColumnClasses()} ${gap} ${className}`}>
      {itemClassName ? renderChildren() : children}
    </div>
  );
};

export default GridLayout;
