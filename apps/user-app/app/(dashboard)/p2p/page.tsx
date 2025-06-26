import { SendMoneyCard } from "../../../components/SendMoneyCard";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { P2PTransactions } from "../../../components/P2PTransactions";
import { requireAuth } from "../../lib/requireAuth";

async function getp2pTransactions() {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);
  if (!userId || isNaN(userId)) return [];
  const txns = await prisma.p2pTransfer.findMany({
    where: {
      OR: [{ fromUserId: userId }, { toUserId: userId }],
    },
    orderBy: {
      timestamp: "desc",
    },
    take: 5,
  });
  return txns.map((t) => ({
    time: t.timestamp,
    amount: t.amount,
    to: t.toUserId,
    from: t.fromUserId,
    id: t.id,
  }));
}
export default async function () {
  const transactions = await getp2pTransactions();
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);

  const user = await requireAuth();
  return (
    <div className="w-screen">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Send Money
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 p-4 place-items-center">
        <div className="min-w-[350px] p-2 transition-transform hover:scale-[1.01] mt-[-150px] ml-[-100px]">
          <SendMoneyCard />
        </div>

        <div className="min-w-[500px] p-2 transition-transform hover:scale-[1.01] mr-20 mt-[-90px]">
          <P2PTransactions transactions={transactions} userId={userId} />
        </div>
      </div>
    </div>
  );
}
