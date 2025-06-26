"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";
import axios from "axios";
export async function createORT(amount: number, provider: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("User not authenticated");
  }
  const userId = session?.user?.id;
  if (!userId) {
    return {
      message: "User ID not found in session",
    };
  }

  const transaction = await prisma.onRampTransaction.create({
    data: {
      userId: Number(userId),
      amount: amount,
      provider: provider,
      status: "Processing",
      token: Math.random().toString(36).substring(2, 15),
      startTime: new Date(),
    },
  });

  return {
    message: "Transaction created successfully",
    transaction: {
      id: transaction.id,
      amount: transaction.amount,
      provider: transaction.provider,
      status: transaction.status,
      token: transaction.token,
      userId: transaction.userId,
    },
  };
}
