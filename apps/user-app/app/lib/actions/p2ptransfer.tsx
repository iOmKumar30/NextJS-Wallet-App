"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";
import { timeStamp } from "console";

export async function p2pTransfer(phone: string, amount: number) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("User not authenticated");
  }
  const sender = session?.user?.id;

  if (!sender) {
    return {
      message: "User ID not found in session",
    };
  }
  const receiver = await prisma.user.findFirst({
    where: {
      number: phone,
    },
  });
  if (!receiver) {
    return {
      message: "Receiver not found",
    };
  }

  // perform the transaction
  await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(sender)} FOR UPDATE`;
    const senderBalance = await tx.balance.findFirst({
      where: {
        userId: Number(sender),
      },
    });
    if (!senderBalance) {
      throw new Error("Could not find sender balance");
    }
    if (senderBalance.amount < amount) {
      throw new Error("Insufficient balance");
    }

    await tx.balance.update({
      where: {
        userId: Number(sender),
      },
      data: {
        amount: { decrement: amount },
      },
    });

    const receiverBalance = await tx.balance.findFirst({
      where: {
        userId: receiver.id,
      },
    });

    if (receiverBalance) {
      await tx.balance.update({
        where: {
          userId: receiver.id,
        },
        data: {
          amount: { increment: amount },
        },
      });
    } else {
      await tx.balance.create({
        data: {
          userId: receiver.id,
          amount: amount,
          locked: 0,
        },
      });
    }
  });
  const p2pTransaction = await prisma.p2pTransfer.create({
    data: {
      fromUserId: Number(sender),
      toUserId: receiver.id,
      amount: amount,
      timestamp: new Date(),
    },
  });
  return {
    message: "Transfer successful",
    status: "success",
    transaction: {
      id: p2pTransaction.id,
      fromUserId: p2pTransaction.fromUserId,
      toUserId: p2pTransaction.toUserId,
      amount: p2pTransaction.amount,
      timestamp: p2pTransaction.timestamp,
    },
  };
}
