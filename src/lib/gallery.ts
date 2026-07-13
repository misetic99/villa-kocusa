export const villaPhotos: { src: string; label: string }[] = Array.from(
  { length: 9 },
  (_, i) => ({
    src: `/images/opcenito/opcenito-${String(i + 1).padStart(2, "0")}.jpg`,
    label: "Villa Koćuša",
  })
);

export const heroPhoto = villaPhotos[0];
