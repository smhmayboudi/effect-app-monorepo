import { faker } from "@faker-js/faker";

// Set a fixed seed for consistent data generation
faker.seed(67890);

export const users = Array.from({ length: 500 }, () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    createdAt: faker.date.past(),
    email: faker.internet.email({ firstName }).toLocaleLowerCase(),
    firstName,
    id: faker.string.uuid(),
    lastName,
    phoneNumber: faker.phone.number({ style: "international" }),
    role: faker.helpers.arrayElement([
      "superadmin",
      "admin",
      "cashier",
      "manager",
    ]),
    status: faker.helpers.arrayElement([
      "active",
      "inactive",
      "invited",
      "suspended",
    ]),
    updatedAt: faker.date.recent(),
    username: faker.internet
      .username({ firstName, lastName })
      .toLocaleLowerCase(),
  };
});
