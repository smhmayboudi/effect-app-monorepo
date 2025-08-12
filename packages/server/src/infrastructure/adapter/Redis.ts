import { layerResult } from "@effect/experimental/Persistence/Redis"

export const Redis = layerResult({
  host: "127.0.0.1",
  port: 6379
})
