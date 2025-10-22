"use client";

import {
  Atom,
  Registry,
  Result,
  useAtom,
  useAtomValue,
} from "@effect-atom/atom-react";
import { Array, Data, Effect, Schema } from "effect";
import { type FC, useRef } from "react";

class Service extends Schema.Class<Service>("Service")({
  id: Schema.String,
  ownerId: Schema.String,
  title: Schema.String,
}) {}

const remoteGetAtom = Atom.make(
  Effect.sleep("1 second").pipe(Effect.as([] as Service[])),
);

type CacheUpdate = Data.TaggedEnum<{
  Create: { name: string };
  Delete: { id: string };
  Update: { id: string; title: string };
}>;
const CacheUpdate = Data.taggedEnum<CacheUpdate>();

const getAtom = Atom.writable(
  (get) => get(remoteGetAtom),
  (ctx, update: CacheUpdate) => {
    const result = ctx.get(getAtom);
    if (result._tag !== "Success") {
      return;
    }

    const newResult = CacheUpdate.$match(update, {
      Create: (args) =>
        Array.append(
          result.value,
          new Service({
            id: crypto.randomUUID(),
            ownerId: "current-user",
            title: args.name,
          }),
        ),
      Delete: (args) => Array.filter(result.value, (t) => t.id !== args.id),
      Update: (args) =>
        Array.modify(
          result.value,
          result.value.findIndex((t) => t.id === args.id),
          (t) => new Service({ ...t, title: args.title }),
        ),
    });

    ctx.setSelf(Result.success(newResult));
  },
);

const createAtom = Atom.fn(
  Effect.fn(function* (_input: { name: string }, get: Atom.FnContext) {
    yield* Effect.sleep("0.25 seconds");
    get.set(getAtom, CacheUpdate.Create({ name: _input.name }));
  }),
);

const updateAtom = Atom.family((id: string) =>
  Atom.fn(
    Effect.fn(function* (input: { title: string }) {
      const registry = yield* Registry.AtomRegistry;
      yield* Effect.sleep("0.3 seconds");
      registry.set(getAtom, CacheUpdate.Update({ id, title: input.title }));
    }),
  ),
);

const deleteAtom = Atom.family((id: string) =>
  Atom.fn(
    Effect.fn(function* () {
      const registry = yield* Registry.AtomRegistry;
      yield* Effect.sleep("0.2 seconds");
      registry.set(getAtom, CacheUpdate.Delete({ id }));
    }),
  ),
);

const Form = () => {
  const [result, createService] = useAtom(createAtom);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    await createService({
      name: formData.get("name") as string,
    });
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <input name="name" placeholder="Name" type="text" />
      <button type="submit">{result.waiting ? "Creating..." : "Create"}</button>
    </form>
  );
};

const ServiceItem: FC<{ service: Service }> = ({ service }) => {
  const [updateResult, updateService] = useAtom(updateAtom(service.id));
  const [deleteResult, deleteService] = useAtom(deleteAtom(service.id));

  return (
    <li>
      <div>
        <span>{service.id}</span>
        <span>{service.ownerId}</span>
        <input
          disabled={updateResult.waiting}
          onChange={(e) => updateService({ title: e.target.value })}
          type="text"
          value={service.title}
        />
        <button disabled={deleteResult.waiting} onClick={() => deleteService()}>
          {deleteResult.waiting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </li>
  );
};

const ServiceList = ({ services }: { services: readonly Service[] }) => (
  <ul>
    {services.map((service) => (
      <ServiceItem key={service.id} service={service} />
    ))}
  </ul>
);

const ServicesCRUD = () => {
  const servicesResult = useAtomValue(getAtom);

  return (
    <div>
      <Form />
      {Result.builder(servicesResult)
        .onInitial(() => <div>Loading services...</div>)
        .onDefect(() => <div>Unexpected error loading services</div>)
        .onSuccess((services) => <ServiceList services={services} />)
        .render()}
    </div>
  );
};

export default function Page() {
  return <ServicesCRUD />;
}
