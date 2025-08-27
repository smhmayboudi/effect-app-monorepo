import { Context } from "effect"
import type { Redis } from "ioredis"

export class PortRedis extends Context.Tag("PortRedis")<PortRedis, Redis>() {}
