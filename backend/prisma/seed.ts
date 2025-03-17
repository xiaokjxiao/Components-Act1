// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// async function main() {
//   await prisma.magic8BallResponse.createMany({
//     data: [
//       { text: "Skibidi yes yes yes! 🚽🕺" },
//       { text: "For real, for real! No cap! 🧢" },
//       { text: "Bet. Do it, no hesitation." },
//     ],
//   });

//   console.log("Seeding complete!");
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.form.createMany({
    data: [
      {
        firstName: "John",
        lastName: "Doe",
        groupName: "Group A",
        role: "Developer",
        expectedSalary: 60000,
        expectedDateOfDefense: new Date("2023-12-01T00:00:00Z"),
      },
      {
        firstName: "Krystal",
        lastName: "Jane",
        groupName: "The Avengers",
        role: "Model",
        expectedSalary: 100000,
        expectedDateOfDefense: new Date("2024-01-10T03:32:12Z"),
      },
    ],
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
