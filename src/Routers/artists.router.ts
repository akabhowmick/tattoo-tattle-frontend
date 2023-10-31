/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Router } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { PrismaClient, Prisma } from "@prisma/client";
import { Artist } from "../types/interface";
import {
  comparePassword,
  createTokenForUser,
  createUnsecuredInfo,
  artistAuthenticationMiddleware,
  // @ts-ignore
} from "./auth-utils.ts";

const prisma = new PrismaClient();

const artistsRouter = Router();

artistsRouter.get("/", async (_req, res) => {
  const artists = await prisma.artist.findMany();
  res.status(200).send(artists);
});

artistsRouter.get("/:id", async (req, res) => {
  const id = +req.params.id;
  const artist = await prisma.artist
    .findUnique({
      where: {
        id,
      },
    })
    .catch(() => "server-error");
  if (artist === "server-error") {
    return res.status(400).send({ message: "id should be a number" });
  }
  if (!artist) {
    return res.status(204).send({ error: "Nothing found" });
  }
  return res.status(200).send(artist);
});

const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});
artistsRouter.post(
  "/login",
  validateRequest({
    body: loginSchema,
  }),
  async (req, res) => {
    const { email, password } = req.body;
    const artist = await prisma.artist
      .findUnique({
        where: {
          email,
        },
      })
      .catch();
    if (!artist) {
      return res.status(204).send({ error: "No Content" });
    } else {
      const checkPassword: boolean = await comparePassword(
        password,
        artist!.password
      );
      if (checkPassword) {
        const userInfo = createUnsecuredInfo(artist as Artist);
        const userToken = await createTokenForUser(userInfo);
        return res.status(200).send({ token: userToken, user: userInfo });
      }
      return res.status(401).send({ message: "Invalid password" });
    }
  }
);

// no auth needed to make a new artist
const artistSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  password: z.string(),
  phoneNumber: z.string(),
  type: z.string(),
  id: z.number(),
  statesLocation: z.string(),
  tattooStyles: z.string(),
});
const createArtistSchema = artistSchema.omit({ id: true }).strict();

artistsRouter.post(
  "/",
  validateRequest({
    body: createArtistSchema,
  }),
  async (req, res) => {
    try {
      const newArtist = await prisma.artist.create({
        data: {
          ...req.body,
        },
      });
      res.status(201).send(newArtist);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === "P2002") {
          console.log(
            "There is a unique constraint violation, a new user cannot be created with this email"
          );
        }
      }
      throw e;
    }
  }
);

//artist authentication and authorization needed
const updateArtistSchema = createArtistSchema.partial();
artistsRouter.patch(
  "/:id",
  validateRequest({
    body: updateArtistSchema.strict().partial(),
  }),
  artistAuthenticationMiddleware,
  async (req, res) => {
    const id = +req.params.id;
    const authorizedArtistEmail = req.user!.email!;
    try {
      const updateArtist: Artist = await prisma.artist.update({
        where: {
          id,
          email: authorizedArtistEmail,
        },
        data: {
          email: req.body.email,
          password: req.body.password,
        },
      });
      return res.status(201).send(updateArtist);
    } catch (e) {
      return res
        .status(204)
        .send({ error: "Nothing found in your authorized request list" });
    }
  }
);

export { artistsRouter };
