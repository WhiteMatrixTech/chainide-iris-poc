"use client";
import { init, transfer } from "@/components/wallet";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.onload = async () => {
      await init();
    };
  }, []);

  const transferValue = async () => {
    const recipientInput = document.getElementById(
      "recipient"
    ) as HTMLInputElement;
    const amountInput = document.getElementById("amount") as HTMLInputElement;

    const recipient = recipientInput.value;
    const amount = amountInput.value;

    // console.log(recipient, amount);

    await transfer(recipient, amount);
  };
  return (
    <main className="min-h-screen  p-24">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Recipient
        </label>
        <input
          type="text"
          id="recipient"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="iaa1xt487wnadzuylgqg5ueajd3ahecg9r0mdt7pxs"
          required
          value={"iaa1xt487wnadzuylgqg5ueajd3ahecg9r0mdt7pxs"}
        />
      </div>
      <br />
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Amount
        </label>
        <input
          type="text"
          id="amount"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="0.1"
          required
          value={"0.1"}
        />
      </div>
      <br />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={transferValue}
      >
        transfer
      </button>
    </main>
  );
}
