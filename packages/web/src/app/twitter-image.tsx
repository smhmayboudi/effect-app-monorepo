import { ImageResponse } from "next/og"

export const alt = "web"
export const size = {
  height: 1024,
  width: 1024,
}

export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "white",
          display: "flex",
          fontSize: 128,
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        web
      </div>
    ),
    {
      ...size,
    },
  )
}
