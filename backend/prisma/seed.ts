import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.magic8BallResponse.createMany({
    data: [
      { text: "Skibidi yes yes yes! 🚽🕺" },
      { text: "For real, for real! No cap! 🧢" },
      { text: "Bet. Do it, no hesitation." },
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
