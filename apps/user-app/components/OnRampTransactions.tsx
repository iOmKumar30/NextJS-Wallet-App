import { Card } from "@repo/ui/card";

export const OnRampTransactions = ({
  transactions,
}: {
  transactions: {
    time: Date;
    amount: number;
    status: string;
    provider: string;
    id: number;
  }[];
}) => {
  if (!transactions.length) {
    return (
      <Card title="Recent Transactions">
        <div className="text-center pb-8 pt-8">No Recent transactions</div>
      </Card>
    );
  }
  return (
    <Card title="Recent Transactions">
      <div className="pt-2">
        {transactions.map((t) => (
          <div
            className="flex justify-between border-b-2 py-2 border-slate-300"
            key={t.id}
          >
            <div
              className={
                t.status === "Success"
                  ? "text-green-600"
                  : t.status === "Failure"
                    ? "text-red-600"
                    : t.status === "Processing"
                      ? "text-blue-600"
                      : ""
              }
            >
              <div className="text-sm">Received INR</div>
              <div className="text-slate-600 text-xs">
                {t.time.toDateString()}
              </div>
            </div>
            {t.status === "Processing" ? (
              <div className="text-blue-600">Processing...</div>
            ) : t.status === "Failure" ? (
              <div className="text-red-600">Failed!!!</div>
            ) : (
              <div className="text-green-600">Success!</div>
            )}
            <div
              className={`flex flex-col justify-center ${
                t.status === "Success"
                  ? "text-green-600"
                  : t.status === "Failure"
                    ? "text-red-600"
                    : t.status === "Processing"
                      ? "text-blue-600"
                      : ""
              }`}
            >
              + Rs {t.amount / 100}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
