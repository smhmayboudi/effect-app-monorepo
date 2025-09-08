// import { ATTR_CODE_FUNCTION_NAME } from "@opentelemetry/semantic-conventions/incubating"
// import type { SecondaryStorage } from "better-auth"

// import type { PortCacher } from "../../application/port/cacher/cacher.ts"
// import type { PortConfig } from "../../application/port/config/config.ts"
// import type { PortLogger } from "../../application/port/logger/logger.ts"

// export class AuthSecondaryStorage implements SecondaryStorage {
//   constructor(
//     private readonly cacher: PortCacher,
//     private readonly config: PortConfig,
//     private readonly logger: PortLogger
//     // private readonly tracer: PortTracer,
//   ) {}

//   get(key: string): Promise<string | null> | string | null {
//     // this.logger.assign({
//     //   [ATTR_CODE_FUNCTION_NAME]: "get-AuthSecondaryStorage-auth.infrastructure",
//     //   config: this.config,
//     //   key
//     // })
//     // this.logger.debug({})
//     const value = this.cacher
//       .get<"AuthSecondaryStorage">(
//         this.cacher.key<"AuthSecondaryStorage">({ key }).AuthSecondaryStorage
//       )
//       .then((value) => value?.value ?? null)
//     // this.logger.debug({ value })

//     return value
//   }

//   set(
//     key: string,
//     value: string,
//     ttl?: number
//   ): Promise<void | null | string> | void {
//     // this.logger.assign({
//     //   [ATTR_CODE_FUNCTION_NAME]: "set-AuthSecondaryStorage-auth.infrastructure",
//     //   config: this.config,
//     //   key,
//     //   ttl,
//     //   value
//     // })
//     // this.logger.debug({})
//     this.cacher.set<"AuthSecondaryStorage">(
//       this.cacher.key<"AuthSecondaryStorage">({ key }).AuthSecondaryStorage,
//       { value },
//       ttl
//     )
//   }

//   delete(key: string): Promise<void | null | string> | void {
//     // this.logger.assign({
//     //   [ATTR_CODE_FUNCTION_NAME]: "delete-AuthSecondaryStorage-auth.infrastructure",
//     //   config: this.config,
//     //   key
//     // })
//     // this.logger.debug({})
//     this.cacher.del(
//       this.cacher.key<"AuthSecondaryStorage">({ key }).AuthSecondaryStorage
//     )
//   }
// }
