import { getSession } from "next-auth/react";
import Layout from "@/components/Layout";
import Grid from "@/components/Grid";
import { prisma } from "@/lib/prisma";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  // If not, redirect to the homepage
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Retrieve the authenticated user
  const { favoriteHomes } = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      favoriteHomes: {
        include: {
          users: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      },
    },
  });

  const addLike = favoriteHomes.map((home) => ({
    ...home,
    favorite: home.users.some((user) => user.email === session.user.email),
  }));
  // Pass the data to the Homes component
  return {
    props: {
      homes: JSON.parse(JSON.stringify(addLike)),
    },
  };
}

const Favorites = ({ homes = [] }) => {
  console.log(homes);
  return (
    <Layout>
      <h1 className="text-xl font-medium text-gray-800">Your listings</h1>
      <p className="text-gray-500">
        Manage your homes and update your listings
      </p>
      <div className="mt-8">
        <Grid homes={homes} />
      </div>
    </Layout>
  );
};

export default Favorites;
