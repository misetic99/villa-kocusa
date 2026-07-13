import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const markSvg = readFileSync(path.join(root, "public/logo-source-mark.svg"));

// app/icon.svg — modern browsers use this directly as favicon
mkdirSync(path.join(root, "src/app"), { recursive: true });
writeFileSync(path.join(root, "src/app/icon.svg"), markSvg);

// apple-icon.png — opaque cream background, iOS applies its own rounding/mask
const appleIconSize = 180;
const cream = "#FBF6EC";
await sharp({
  create: {
    width: appleIconSize,
    height: appleIconSize,
    channels: 4,
    background: cream,
  },
})
  .composite([
    {
      input: await sharp(markSvg).resize(140, 140).toBuffer(),
      gravity: "center",
    },
  ])
  .png()
  .toFile(path.join(root, "src/app/apple-icon.png"));

console.log("Generated src/app/icon.svg and src/app/apple-icon.png");
