/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Router } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { PrismaClient } from "@prisma/client";
import {
  clientAuthenticationMiddleware,
  artistAuthenticationMiddleware,
  // @ts-ignore
} from "./auth-utils.ts";
import { Request } from "../types/interface";
const prisma = new PrismaClient();

const requestsRouter = Router();

//no auth required
requestsRouter.get("/", async (_req, res) => {
  const requests = await prisma.request.findMany();
  res.status(200).send(requests);
});

//no auth required
requestsRouter.get("/:id", async (req, res) => {
  const id = +req.params.id;
  const request = await prisma.request
    .findUnique({
      where: {
        id,
      },
    })
    .catch(() => "server-error");
  if (request === "server-error") {
    return res.status(400).send({ message: "id should be a number" });
  }
  if (!request) {
    return res.status(204).send({ error: "Nothing found" });
  }
  return res.status(200).send(request);
});

const requestSchema = z.object({
  clientName: z.string(),
  artistName: z.string(),
  messageBody: z.string(),
  approvalStatus: z.string(),
  tattooOfInterestTitle: z.string(),
  artistId: z.number(),
  clientId: z.number(),
  id: z.number(),
});
const createRequestSchema = requestSchema.omit({ id: true }).strict();

//client authentication used
requestsRouter.post(
  "/",
  validateRequest({
    body: createRequestSchema,
  }),
  clientAuthenticationMiddleware,
  async (req, res) => {
    try {
      const newRequest = await prisma.request.create({
        data: {
          ...req.body,
        },
      });
      res.status(201).send(newRequest);
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: "Server Side Error" });
    }
  }
);

//artist authentication and authorization needed
const updateRequestSchema = createRequestSchema.partial();
requestsRouter.patch(
  "/:id",
  artistAuthenticationMiddleware,
  validateRequest({
    body: updateRequestSchema.strict().partial(),
  }),
  async (req, res) => {
    const authorizedArtistId = req.user!.id!;
    const id = +req.params.id;
    try {
      const updateRequest: Request = await prisma.request.update({
        where: {
          id,
          artistId: authorizedArtistId,
        },
        data: {
          approvalStatus: req.body.approvalStatus,
        },
      });
      return res.status(201).send(updateRequest);
    } catch (e) {
      return res
        .status(204)
        .send({ error: "Nothing found in your authorized request list" });
    }
  }
);

export { requestsRouter };
