import { getSebastianAbout } from "@/lib/about";

export const prerender = true;

export function GET() {
  return new Response(JSON.stringify(getSebastianAbout(), null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
