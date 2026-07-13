"use client";

import { useId } from "react";

export function LogoMark({ size = 44 }: { size?: number }) {
  const gradientId = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="255 65 170 170"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Villa Koćuša monogram"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#A67C27" />
          <stop offset="50%" stopColor="#F0DFA0" />
          <stop offset="100%" stopColor="#A67C27" />
        </linearGradient>
      </defs>
      <circle
        cx="340"
        cy="150"
        r="72"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.5"
      />
      <circle
        cx="340"
        cy="150"
        r="62"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="0.5"
        opacity="0.6"
      />
      <text
        x="340"
        y="168"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="50"
        fill={`url(#${gradientId})`}
      >
        VK
      </text>
    </svg>
  );
}

export function LogoFull({ width = 340 }: { width?: number }) {
  const gradientId = useId();
  const height = (width * 380) / 680;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 680 380"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Villa Koćuša"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#A67C27" />
          <stop offset="50%" stopColor="#F0DFA0" />
          <stop offset="100%" stopColor="#A67C27" />
        </linearGradient>
      </defs>

      <line x1="60" y1="150" x2="248" y2="150" stroke={`url(#${gradientId})`} strokeWidth="1" />
      <circle cx="60" cy="150" r="2.5" fill={`url(#${gradientId})`} />
      <line x1="432" y1="150" x2="620" y2="150" stroke={`url(#${gradientId})`} strokeWidth="1" />
      <circle cx="620" cy="150" r="2.5" fill={`url(#${gradientId})`} />

      <circle cx="340" cy="150" r="72" fill="none" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
      <circle
        cx="340"
        cy="150"
        r="62"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="0.5"
        opacity="0.6"
      />

      <text
        x="340"
        y="168"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="50"
        fill={`url(#${gradientId})`}
      >
        VK
      </text>

      <line x1="300" y1="246" x2="380" y2="246" stroke={`url(#${gradientId})`} strokeWidth="1" />
      <rect
        x="336"
        y="242"
        width="8"
        height="8"
        fill={`url(#${gradientId})`}
        transform="rotate(45 340 246)"
      />

      <text
        x="340"
        y="300"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="32"
        letterSpacing="4"
        fill={`url(#${gradientId})`}
      >
        VILLA KOĆUŠA
      </text>

      <text
        x="340"
        y="330"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="13"
        letterSpacing="6"
        fill="#8B7355"
      >
        A P A R T M A N I
      </text>
    </svg>
  );
}
