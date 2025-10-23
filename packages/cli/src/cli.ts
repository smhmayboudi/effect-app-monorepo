import * as Args from "@effect/cli/Args"
import * as Command from "@effect/cli/Command"
import * as Options from "@effect/cli/Options"
import { TodoId } from "@template/domain/todo/application/TodoApplicationDomain"
import * as Effect from "effect/Effect"
import { PortTodoClient } from "./TodoClient.js"

const todoArg = Args.text({ name: "todo" }).pipe(
  Args.withDescription("The message associated with a todo")
)

const todoId = Options.withSchema(Options.text("id"), TodoId).pipe(
  Options.withDescription("The identifier of the todo")
)

const add = Command.make("add", { todo: todoArg }).pipe(
  Command.withDescription("Add a new todo"),
  Command.withHandler(({ todo }) =>
    PortTodoClient.pipe(
      Effect.flatMap((todoClient) => todoClient.create(todo))
    )
  )
)

const done = Command.make("done", { id: todoId }).pipe(
  Command.withDescription("Mark a todo as done"),
  Command.withHandler(({ id }) =>
    PortTodoClient.pipe(
      Effect.flatMap((todoClient) => todoClient.update(id))
    )
  )
)

const list = Command.make("list").pipe(
  Command.withDescription("List all todos"),
  Command.withHandler(() =>
    PortTodoClient.pipe(
      Effect.flatMap((todoClient) => todoClient.readAll())
    )
  )
)

const remove = Command.make("remove", { id: todoId }).pipe(
  Command.withDescription("Remove a todo"),
  Command.withHandler(({ id }) =>
    PortTodoClient.pipe(
      Effect.flatMap((todoClient) => todoClient.delete(id))
    )
  )
)

const command = Command.make("todo").pipe(
  Command.withSubcommands([add, done, list, remove])
)

export const cli = Command.run(command, {
  name: "Todo CLI",
  version: "0.0.0"
})
