export const dynamic = "force-static";

const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="2" fill="#111111"/>
  <text x="32" y="40" fill="#f2f2f2" font-family="Georgia, 'Times New Roman', serif" font-size="24" font-weight="700" text-anchor="middle">SB</text>
</svg>`;

export function GET() {
  return new Response(icon, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": "image/svg+xml",
    },
  });
}
