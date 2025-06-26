"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { Select } from "@repo/ui/select";
import { useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import { createORT } from "../app/lib/actions/createOnRampTransaction";
import { Modal } from "@repo/ui/modal";
import axios from "axios";
const SUPPORTED_BANKS = [
  {
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com",
  },
  {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/",
  },
];
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const AddMoney = () => {
  const [redirectUrl, setRedirectUrl] = useState(
    SUPPORTED_BANKS[0]?.redirectUrl
  );
  const [amount, setAmount] = useState("");
  const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");
  const [showModal, setShowModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<any>(null);

  return (
    <Card title="Add Money">
      <div className="w-full">
        <TextInput
          label={"Amount"}
          placeholder={"Amount"}
          onChange={(value) => {
            setAmount(value);
          }}
        />
        <div className="py-4 text-left">Bank</div>
        <Select
          onSelect={(value) => {
            setRedirectUrl(
              SUPPORTED_BANKS.find((x) => x.name === value)?.redirectUrl || ""
            );
            setProvider(value);
          }}
          options={SUPPORTED_BANKS.map((x) => ({
            key: x.name,
            value: x.name,
          }))}
        />
        <div className="flex justify-center pt-4">
          <Button
            onClick={async () => {
              const res = await createORT(Number(amount) * 100, provider);
              if (!res.transaction) {
                alert("Transaction data is missing");
                return {
                  message: "Transaction data is missing",
                };
              }
              setCurrentTransaction(res.transaction);
              setShowModal(true);
            }}
          >
            Add Money
          </Button>
        </div>
      </div>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="p-4 items-center text-center">
            <h1>Simulate Bank Response</h1>
            <div className="flex gap-4 mt-4 items-center justify-center">
              <Button
                onClick={async () => {
                  await axios.post("http://localhost:3003/bankWebhook", {
                    token: currentTransaction.token,
                    userId: currentTransaction.userId,
                    amount: currentTransaction.amount,
                    status: "Success",
                  });
                  setShowModal(false);
                  window.location.reload();
                }}
              >
                Success
              </Button>
              <Button
                onClick={async () => {
                  await axios.post("http://localhost:3003/bankWebhook", {
                    token: currentTransaction.token,
                    userId: currentTransaction.userId,
                    amount: currentTransaction.amount,
                    status: "Failure",
                  });
                  setShowModal(false);
                  window.location.reload();
                }}
              >
                Failure
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  );
};
