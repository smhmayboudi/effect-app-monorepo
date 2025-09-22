import { AtomHttpApi } from "@effect-atom/atom-react";
import { FetchHttpClient } from "@effect/platform";
import { Api } from "@template/domain/Api";
import { Layer } from "effect";

export class HttpClient extends AtomHttpApi.Tag<HttpClient>()("HttpClient", {
  api: Api,
  baseUrl: "http://127.0.0.1:3001",
  httpClient: FetchHttpClient.layer.pipe(
    Layer.provide(
      Layer.succeed(FetchHttpClient.RequestInit, { credentials: "include" })
    )
  ),
  transformClient: undefined,
  transformResponse: undefined,
}) {}
