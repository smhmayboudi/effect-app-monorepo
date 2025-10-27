import { spawn } from "node:child_process"
import process from "node:process"

const run = (cmd, args, forwardStdin = true) =>
  spawn(cmd, args, {
    shell: true,
    stdio: [forwardStdin ? "inherit" : "ignore", "inherit", "inherit"]
  })

const processes = [
  run("node", ["packages/runner/dist/dist/esm/Runner.js"], false),
  run("node", ["packages/server/dist/dist/esm/Server.js"], false),
  run("node", ["packages/shared-manager/dist/dist/esm/ShardManager.js"], false)
]

const shutdown = () => {
  for (const p of processes) {
    p.kill("SIGINT")
  }
}

process.on("SIGINT", shutdown).on("SIGTERM", shutdown)

for (const p of processes) {
  p.on("exit", shutdown)
}
