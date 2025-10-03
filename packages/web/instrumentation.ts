import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel({
    attributes: {
      [ATTR_SERVICE_NAME]: "web",
      [ATTR_SERVICE_VERSION]: "0.0.0",
    },
  });
}
