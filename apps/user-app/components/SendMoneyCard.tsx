"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { p2pTransfer } from "../app/lib/actions/p2ptransfer";
export function SendMoneyCard() {
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");
  const router = useRouter();
  return (
    <div className="h-[90vh]">
      <Center>
        <Card title="Send Money">
          <div className="min-w-72 pt-2">
            <TextInput
              placeholder={"Number"}
              label="Number"
              onChange={(value) => {
                setNumber(value);
              }}
            />
            <TextInput
              placeholder={"Amount"}
              label="Amount"
              onChange={(value) => {
                setAmount(value);
              }}
            />
            <div className="pt-4 flex justify-center">
              <Button
                onClick={async () => {
                  const res = await p2pTransfer(number, Number(amount) * 100);
                  if (res.status === "success") {
                    alert("Transfer Successful");
                    window.location.reload();
                  } else {
                    alert("Transfer Failed: " + res.message);
                  }
                }}
              >
                Send
              </Button>
            </div>
          </div>
        </Card>
      </Center>
    </div>
  );
}
