import express from "express";
import db from "@repo/db/client";
const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: "*",
    methods: ["POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

app.post("/bankWebhook", async (req, res) => {
  const paymentInformation: {
    token: string;
    userId: string;
    amount: string;
    status?: string;
  } = {
    token: req.body.token,
    userId: req.body.userId,
    amount: req.body.amount,
    status: req.body.status || "Success",
  };

  try {
    const transaction = await db.onRampTransaction.findUnique({
      where: {
        token: paymentInformation.token,
      },
    });

    if (transaction && transaction.status !== "Success") {
      await db.$transaction([
        db.balance.upsert({
          where: {
            userId: Number(paymentInformation.userId),
          },
          create: {
            userId: Number(paymentInformation.userId),
            amount: Number(paymentInformation.amount),
            locked: 0,
          },
          update: {
            amount: {
              increment: Number(paymentInformation.amount),
            },
          }
        }),
        db.onRampTransaction.updateMany({
          where: {
            token: paymentInformation.token,
          },
          data: {
            status: (paymentInformation.status as any) || "Success",
          },
        }),
      ]);
    }

    res.json({
      message: "Captured",
    });
  } catch (e) {
    console.error(e);
    res.status(411).json({
      message: "Error while processing webhook",
    });
  }
});

app.listen(3003);
