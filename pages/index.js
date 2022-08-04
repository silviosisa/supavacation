import Layout from "@/components/Layout";
import Grid from "@/components/Grid";
import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

// Instantiate it
const prisma = new PrismaClient();

export async function getServerSideProps(context) {
  const session = await getSession(context);
  let homes;
  if (!session) {
    homes = await prisma.home.findMany();
    return {
      props: {
        homes: JSON.parse(JSON.stringify(homes)),
      },
    };
  } else {
    homes = await prisma.home.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        users: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
    const addLike = homes.map((home) => ({
      ...home,
      favorite: home.users.some((user) => user.email === session.user.email),
    }));
    return {
      props: {
        homes: JSON.parse(JSON.stringify(addLike)),
      },
    };
  }
}

export default function Home({ homes = [] }) {
  return (
    <Layout>
      <h1 className="text-xl font-medium text-gray-800">
        Top-rated places to stay
      </h1>
      <p className="text-gray-500">
        Explore some of the best places in the world
      </p>
      <div className="mt-8">
        <Grid homes={homes} />
      </div>
    </Layout>
  );
}
