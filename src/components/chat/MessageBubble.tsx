"use client";

import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface MessageBubbleProps {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
}

export default function MessageBubble({
  role,
  content,
  timestamp,
}: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex w-full items-start gap-3",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-primary/10 text-primary",
        )}
      >
        {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <div
          className={cn(
            "max-w-[80%] rounded-lg px-4 py-2.5 shadow-sm",
            isUser
              ? "bg-primary text-primary-foreground"
              : "border bg-card text-card-foreground",
          )}
        >
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {content}
          </p>
        </div>
        {timestamp && (
          <span
            className={cn(
              "text-xs text-muted-foreground",
              isUser ? "text-right" : "text-left",
            )}
          >
            {timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
    </div>
  );
}
