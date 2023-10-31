/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Router } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { PrismaClient } from "@prisma/client";
// @ts-ignore
import { clientAuthenticationMiddleware } from "./auth-utils.ts";
const prisma = new PrismaClient();

const favoritesRouter = Router();

//no auth needed
favoritesRouter.get("/", async (_req, res) => {
  const favorites = await prisma.favorite.findMany();
  res.status(200).send(favorites);
});

//no auth needed
favoritesRouter.get("/:id", async (req, res) => {
  const id = +req.params.id;
  const favorite = await prisma.favorite
    .findUnique({
      where: {
        id,
      },
    })
    .catch(() => "server-error");
  if (favorite === "server-error") {
    return res.status(400).send({ message: "id should be a number" });
  }
  if (!favorite) {
    return res.status(204).send({ error: "Nothing found" });
  }
  return res.status(200).send(favorite);
});

const favoriteSchema = z.object({
  clientId: z.number(),
  tattooId: z.number(),
  id: z.number(),
});
const createFavoriteSchema = favoriteSchema.omit({ id: true }).strict();
//client authentication
favoritesRouter.post(
  "/",
  validateRequest({
    body: createFavoriteSchema,
  }),
  clientAuthenticationMiddleware,
  async (req, res) => {
    try {
      const newFavorite = await prisma.favorite.create({
        data: {
          ...req.body,
        },
      });
      res.status(201).send(newFavorite);
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: "Server Side Error" });
    }
  }
);

//client authentication and authorization
favoritesRouter.delete(
  "/:id",
  clientAuthenticationMiddleware,
  async (req, res) => {
    if (isNaN(parseInt(req.params.id, 10))) {
      return res.status(400).send({ message: "id should be a number" });
    }
    const authorizedClientId = req.user!.id!;
    const id = +req.params.id;
    const deletedFavorite = await prisma.favorite
      .delete({
        where: {
          id,
          clientId: authorizedClientId,
        },
      })
      .catch(() => null);
    if (!deletedFavorite) {
      return res.status(204).send({ error: "Nothing found" });
    }
    return res.status(200).send(`Favorite deleted with id: ${id}`);
  }
);

export { favoritesRouter };
