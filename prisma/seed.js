import { PrismaClient } from "@prisma/client";
import { db_reseed } from "../dbCopy.js";
const prisma = new PrismaClient();

async function main() {
  for (let artist of db_reseed.artists) {
    await prisma.artist.create({
      data: artist,
    });
  }
  for (let client of db_reseed.clients) {
    await prisma.client.create({
      data: client,
    });
  }
  // for (let tattoo of db_reseed.tattoos){
  //   await prisma.tattoo.create({
  //     data: tattoo,
  //   });
  // }
  // for (let request of db_reseed.requests){
  //   await prisma.request.create({
  //     data: request,
  //   });
  // }
  // for (let favorite of db_reseed.favorites){
  //   await prisma.favorite.create({
  //     data: favorite,
  //   });
  // }
  // const db_tattoos = db_reseed.tattoos;
  // db_tattoos.forEach(async (tattoo) => {
  //   console.log("making the following: tattoo")
  //   await prisma.tattoo.create({
  //     data: tattoo,
  //   });
  // });
  // const db_favorites = db_reseed.favorites;
  // db_favorites.forEach(async (favorite) => {
  //   console.log("making the following: favori")
  //   await prisma.favorite.create({
  //     data: favorite,
  //   });
  // });
  // const db_requests = db_reseed.requests;
  // db_requests.forEach(async (request) => {
  //   console.log("making the following: requst")
  //   await prisma.request.create({
  //     data: request,
  //   });
  // });
}

async function main2() {
  for (let tattoo of db_reseed.tattoos) {
    await prisma.tattoo.create({
      data: tattoo,
    });
  }
  for (let request of db_reseed.requests) {
    await prisma.request.create({
      data: request,
    });
  }
  for (let favorite of db_reseed.favorites) {
    await prisma.favorite.create({
      data: favorite,
    });
  }
}

main().then(
  main2()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      // eslint-disable-next-line no-undef
      process.exit(1);
    })
);
