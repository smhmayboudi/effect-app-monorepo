import * as effect from "effect"
import type { Redis } from "ioredis"

export class PortRedis extends effect.Context.Tag("PortRedis")<PortRedis, Redis>() {}
