/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Router } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { PrismaClient } from "@prisma/client";
import { Tattoo } from "../types/interface";
// @ts-ignore
import { artistAuthenticationMiddleware } from "./auth-utils.ts";
const prisma = new PrismaClient();

const tattoosRouter = Router();

//no auth required
tattoosRouter.get("/", async (_req, res) => {
  const tattoos = await prisma.tattoo.findMany();
  res.status(200).send(tattoos);
});

//no auth required
tattoosRouter.get("/:id", async (req, res) => {
  const id: number = +req.params.id;
  const tattoo: Tattoo | null | string = await prisma.tattoo
    .findUnique({
      where: {
        id,
      },
    })
    .catch(() => "server-error");
  if (tattoo === "server-error") {
    return res.status(400).send({ message: "id should be a number" });
  }
  if (!tattoo) {
    return res.status(204).send({ error: "Nothing found" });
  }
  return res.status(200).send(tattoo);
});

const tattooSchema = z.object({
  artistId: z.number(),
  title: z.string(),
  image: z.string(),
  dateCreated: z.string(),
  artistName: z.string(),
  description: z.string(),
  price: z.number(),
  statesInput: z.string(),
  tattooStyleInput: z.string(),
  id: z.number(),
});
const createTattooSchema = tattooSchema.omit({ id: true }).strict();
// artist authentication required
tattoosRouter.post(
  "/",
  validateRequest({
    body: createTattooSchema,
  }),
  artistAuthenticationMiddleware,
  async (req, res) => {
    try {
      const newTattoo = await prisma.tattoo.create({
        data: {
          ...req.body,
        },
      });
      res.status(201).send(newTattoo);
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: "Server Side Error" });
    }
  }
);

//artist authentication and authorization
const updateTattooSchema = createTattooSchema.partial();
tattoosRouter.patch(
  "/:id",
  validateRequest({
    body: updateTattooSchema.strict().partial(),
  }),
  artistAuthenticationMiddleware,
  async (req, res) => {
    const id = +req.params.id;
    const authorizedArtistId = req.user!.id!;
    try {
      const updateTattoo: Tattoo = await prisma.tattoo.update({
        where: {
          id,
          artistId: authorizedArtistId,
        },
        data: {
          title: req.body.title,
          description: req.body.description,
        },
      });
      return res.status(201).send(updateTattoo);
    } catch (e) {
      return res
        .status(204)
        .send({ error: "Nothing found in your authorized request list" });
    }
  }
);

//artist authentication and authorization
tattoosRouter.delete(
  "/:id",
  artistAuthenticationMiddleware,
  async (req, res) => {
    if (isNaN(parseInt(req.params.id, 10))) {
      return res.status(400).send({ message: "id should be a number" });
    }
    const authorizedArtistId = req.user!.id!;
    const id = +req.params.id;
    const deletedTattoo = await prisma.tattoo
      .delete({
        where: {
          id,
          artistId: authorizedArtistId,
        },
      })
      .catch(() => null);
    if (!deletedTattoo) {
      return res.status(204).send({ error: "Nothing found" });
    }
    return res.status(200).send(`Tattoo deleted with id: ${id}`);
  }
);

export { tattoosRouter };
