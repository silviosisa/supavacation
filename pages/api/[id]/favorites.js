import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  // TODO: Check if user is authenticated
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  // Retrieve the authenticated user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  // TODO: Retrieve home ID from request
  const { id } = req.query;

  // TODO: Add home to favorite
  if (req.method === "PUT") {
    try {
      const assToFavorite = await prisma.home.update({
        where: {
          id: id,
        },
        data: {
          users: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      res.status(200).json(assToFavorite);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
  // TODO: Remove home from favorite
  else if (req.method === "DELETE") {
    const removeRelation = await prisma.home.update({
      where: {
        id: id,
      },
      data: {
        users: {
          disconnect: {
            id: user.id,
          },
        },
      },
    });
    res.status(200).json(removeRelation);
  }
  // HTTP method not supported!
  else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
