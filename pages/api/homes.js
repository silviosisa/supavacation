import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// req: An instance of the incoming HTTP request, plus some pre-built middlewares
// res: An instance of the server response object, plus some helper functions
export default async function handler(req, res) {
  // Create new home
  if (req.method === "POST") {
    try {
      const { image, title, description, price, guests, beds, baths } =
        req.body;
      const home = await prisma.home.create({
        data: { image, title, description, price, guests, beds, baths },
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
