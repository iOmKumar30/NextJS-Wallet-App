import { Card } from "@repo/ui/card";

type P2PTransactionsProps = {
  transactions: {
    time: Date;
    amount: number;
    to: number;
    from: number;
    id: number;
  }[];
  userId: number;
};

export const P2PTransactions = ({
  transactions,
  userId,
}: P2PTransactionsProps) => {
  if (!transactions.length) {
    return (
      <Card title="Recent Transactions">
        <div className="text-center pb-8 pt-8">No Recent transactions</div>
      </Card>
    );
  }
  return (
    <Card title="Recent Transactions">
      <div className="pt-4 space-y-3">
        {transactions.map((t) => {
          const isSent = t.from === userId;
          const date = new Date(t.time);
          const formattedDate = date.toLocaleDateString();
          const formattedTime = date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          return (
            <div
              key={t.id}
              className="flex justify-between items-center px-4 py-3 bg-slate-50 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition duration-200"
            >
              <div>
                <div
                  className={`text-sm font-medium ${
                    isSent ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {isSent
                    ? `Sent to User #${t.to}`
                    : `Received from User #${t.from}`}
                </div>
                <div className="text-xs text-gray-500">
                  {formattedDate} {formattedTime}
                </div>
              </div>
              <div className="text-base font-semibold text-gray-800">
                {isSent
                  ? `- ₹${(t.amount / 100).toFixed(2)}`
                  : `+ ₹${(t.amount / 100).toFixed(2)}`}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
