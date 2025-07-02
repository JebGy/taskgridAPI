import prisma from "@/lib/prisma";

async function main() {
  const TODO = await prisma.column.upsert({
    where: { title: "TODO" },
    update: {},
    create: {
      title: "TODO",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
