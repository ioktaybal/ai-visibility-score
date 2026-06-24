"use client";

import React, { useEffect, useState } from "react";

interface CircularProgressProps {
  value: number;
  label: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function CircularProgress({
  value,
  label,
  size = 120,
  strokeWidth = 10,
  color = "var(--primary)"
}: CircularProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress on mount
    const timer = setTimeout(() => {
      setProgress(value);
    }, 300);
    return () => clearTimeout(timer);
  }, [value]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {/* Background Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--border)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div style={{ 
          position: "absolute", 
          top: 0, left: 0, right: 0, bottom: 0, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          fontSize: size > 150 ? "3rem" : "1.5rem",
          fontWeight: "bold",
          color: "var(--foreground)"
        }}>
          {progress}
        </div>
      </div>
      <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--foreground)", opacity: 0.8 }}>
        {label}
      </div>
    </div>
  );
}
