import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();
// req: An instance of the incoming HTTP request, plus some pre-built middlewares
// res: An instance of the server response object, plus some helper functions
export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized." });
  }
  // Create new home
  if (req.method === "POST") {
    try {
      const { image, title, description, price, guests, beds, baths } =
        req.body;
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      console.log(user);
      const home = await prisma.home.create({
        data: {
          image,
          title,
          description,
          price,
          guests,
          beds,
          baths,
          ownerId: user.id,
        },
      });
      res.status(200).json(home);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader("Allow", ["POST"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
