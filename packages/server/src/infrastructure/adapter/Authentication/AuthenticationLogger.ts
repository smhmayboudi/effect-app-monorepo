// import type { Logger, LogLevel } from "better-auth"

// import type { PortLogger } from "../../application/port/logger/logger.ts"

// export class AuthLogger implements Logger {
//   constructor(
//     readonly disabled: boolean,
//     readonly level: Exclude<LogLevel, "success">,
//     private readonly logger: PortLogger
//     // private readonly tracer: PortTracer,
//   ) {}

//   log(
//     level: Exclude<LogLevel, "success">,
//     message: string,
//     ...args: Array<any>
//   ): void {
//     switch (!this.disabled && level) {
//       case "debug":
//         this.logger.debug(message, args)
//         break
//       case "error":
//         this.logger.error(message, args)
//         break
//       case "info":
//         this.logger.info(message, args)
//         break
//       case "warn":
//         this.logger.warn(message, args)
//         break
//       default:
//         throw new Error("Invalid log level")
//     }
//   }
// }

export {}
