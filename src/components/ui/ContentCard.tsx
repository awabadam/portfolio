"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface ContentCardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  hover?: boolean;
  bordered?: boolean;
  onClick?: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({
  title,
  subtitle,
  icon,
  badge,
  children,
  className = "",
  contentClassName = "",
  hover = false,
  bordered = true,
  onClick,
}) => {
  const cardClasses = `
    ${bordered ? "border-primary/20" : "border-none"} 
    bg-card/50 
    backdrop-blur 
    ${
      hover
        ? "transition-all duration-300 hover:border-primary/30 hover:shadow-md"
        : ""
    }
    ${className}
    ${onClick ? "cursor-pointer" : ""}
  `;

  return (
    <Card className={cardClasses} onClick={onClick}>
      {(title || subtitle || badge) && (
        <CardHeader className="pb-2">
          <div className="flex w-full items-center justify-between">
            {icon && (
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                {icon}
              </div>
            )}
            {title && (
              <CardTitle className="text-lg font-medium">{title}</CardTitle>
            )}
            {badge && (
              <Badge variant="outline" className="border-border/60">
                {badge}
              </Badge>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </CardHeader>
      )}
      <CardContent className={`p-4 ${contentClassName}`}>
        {children}
      </CardContent>
    </Card>
  );
};

export default ContentCard;
