import { Game, PrismaClient } from "@prisma/client";
import cors from "cors";
import { convertHourStringToMinute } from "./utils/convert-hour-string-to-minute";
import { convertMinutesToHoursString } from "./utils/convert-minutes-to-hours-string";
const express = require("express");
const app = express();
const port = 3001;

app.use(express.json());

app.use(cors());

const prisma = new PrismaClient({
  log: ["query"],
});

app.get(
  "/games",
  async (_request: any, response: { json: (arg0: Game[]) => any }) => {
    const games = await prisma.game.findMany({
      include: {
        _count: {
          select: {
            ads: true,
          },
        },
      },
    });

    return response.json(games);
  }
);

app.post(
  "/games/:id/ads",
  async (
    request: any,
    response: any) => {
    const gameId = request.params.id;
    const body: any = request.body;

    const ad = await prisma.ad.create({
      data: {
        gameId,
        name: body.name,
        yearsPlaying: body.yearsPlaying,
        discord: body.discord,
        weekDays: body.weekDays.join(","),
        hourStart: convertHourStringToMinute(body.hourStart),
        hourEnd: convertHourStringToMinute(body.hourEnd),
        useVoiceChannel: body.useVoiceChannel,
      },
    });

    return response.status(201).json(ad);
  }
);

app.get(
  "/games/:id/ads",
  async (
    _req: any,
    res: {
      json: (arg0: { weekDays: string[]; id: string; name: string }[]) => any;
    }
  ) => {
    const gameId = _req.params.id;
    const ads = await prisma.ad.findMany({
      select: {
        id: true,
        name: true,
        weekDays: true,
        hourStart: true,
        hourEnd: true,
      },
      where: {
        gameId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(
      ads.map((ad) => {
        return {
          ...ad,
          weekDays: ad.weekDays.split(","),
          hourStart: convertMinutesToHoursString(ad.hourStart),
          hourEnd: convertMinutesToHoursString(ad.hourEnd),
        };
      })
    );
  }
);

app.get(
  "/ads/:id/discord",
  async (
    _req: { params: { id: any } },
    res: { json: (arg0: { discord: string }) => any }
  ) => {
    const adId = _req.params.id;

    const ad = await prisma.ad.findUniqueOrThrow({
      select: {
        discord: true,
      },
      where: {
        id: adId,
      },
    });

    return res.json({
      discord: ad.discord,
    });
  }
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
