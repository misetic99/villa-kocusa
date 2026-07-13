import type { AmenityKey } from "@/lib/types";
import { dictionaries, type Locale } from "@/lib/i18n/dictionary";
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

const WifiIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M3 8.5C8.5 3.5 15.5 3.5 21 8.5" />
    <path d="M6.5 12.2C10 9 14 9 17.5 12.2" />
    <path d="M10 15.8C11.4 14.6 12.6 14.6 14 15.8" />
    <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
  </Base>
);

const ParkingIcon = (props: IconProps) => (
  <Base {...props}>
    <rect x="4" y="3.5" width="16" height="17" rx="2" />
    <path d="M9.5 17V7h3.4a3 3 0 0 1 0 6H9.5" />
  </Base>
);

const AcIcon = (props: IconProps) => (
  <Base {...props}>
    <rect x="3" y="6" width="18" height="6" rx="1.5" />
    <path d="M6 15v3M10 15v4M14 15v3M18 15v4" />
  </Base>
);

const SeaViewIcon = (props: IconProps) => (
  <Base {...props}>
    <circle cx="12" cy="8" r="3.2" />
    <path d="M3 14c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0 3 1.3 4.5 0" />
    <path d="M3 18.5c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0 3 1.3 4.5 0" />
  </Base>
);

const KitchenIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M5 3v7a3 3 0 0 0 3 3v8" />
    <path d="M5 3v5M8 3v5" />
    <path d="M17 3c-1.7 0-3 2-3 5.5S15.3 13 17 13v8" />
  </Base>
);

const TerraceIcon = (props: IconProps) => (
  <Base {...props}>
    <path d="M3 9 12 4l9 5" />
    <path d="M5 9v10M19 9v10" />
    <path d="M9 19v-6h6v6" />
    <path d="M3 19h18" />
  </Base>
);

const WasherIcon = (props: IconProps) => (
  <Base {...props}>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <circle cx="12" cy="13" r="4.2" />
    <path d="M8 6.2h.01M11 6.2h.01" />
  </Base>
);

const PetsIcon = (props: IconProps) => (
  <Base {...props}>
    <circle cx="7" cy="9" r="1.6" />
    <circle cx="12" cy="6.5" r="1.6" />
    <circle cx="17" cy="9" r="1.6" />
    <circle cx="9.5" cy="13" r="1.6" />
    <path d="M8 17.5c0-2.2 1.8-3.5 4-3.5s4 1.3 4 3.5-1.8 2.8-4 2.8-4-.6-4-2.8Z" />
  </Base>
);

const TvIcon = (props: IconProps) => (
  <Base {...props}>
    <rect x="3" y="5" width="18" height="12" rx="1.5" />
    <path d="M9 21h6M12 17v4" />
  </Base>
);

const SafeIcon = (props: IconProps) => (
  <Base {...props}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 8.8V12l2 1.4" />
  </Base>
);

const AMENITY_ICON: Record<AmenityKey, (props: IconProps) => React.ReactElement> = {
  wifi: WifiIcon,
  parking: ParkingIcon,
  ac: AcIcon,
  "sea-view": SeaViewIcon,
  kitchen: KitchenIcon,
  terrace: TerraceIcon,
  washer: WasherIcon,
  pets: PetsIcon,
  tv: TvIcon,
  safe: SafeIcon,
};

export function amenityLabel(amenity: AmenityKey, locale: Locale): string {
  return dictionaries[locale].amenities[amenity];
}

export function AmenityIcon({
  amenity,
  ...props
}: { amenity: AmenityKey } & IconProps) {
  const Icon = AMENITY_ICON[amenity];
  return <Icon {...props} />;
}
