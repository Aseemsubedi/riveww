import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ error: "Missing slug." }, { status: 400 });
  }

  const origin = request.nextUrl.origin;
  const reviewUrl = `${origin}/r/${slug}`;
  const qrSource = `https://api.qrserver.com/v1/create-qr-code/?size=640x640&format=png&margin=20&data=${encodeURIComponent(
    reviewUrl
  )}`;

  const qrResponse = await fetch(qrSource, { cache: "no-store" });
  if (!qrResponse.ok) {
    return NextResponse.json(
      { error: "Could not generate QR code right now." },
      { status: 502 }
    );
  }

  const imageBuffer = await qrResponse.arrayBuffer();
  return new NextResponse(imageBuffer, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=300",
    },
  });
}
