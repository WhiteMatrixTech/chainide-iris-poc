"use client";
import {
  doMintToken,
  doQueryToken,
  doSwapFeeToken,
  init,
  mintToken,
  transfer,
} from "@/components/wallet";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.onload = async () => {
      await init();
    };
  }, []);

  const mintToken = async () => {
    const symbolInput = document.getElementById("symbol") as HTMLInputElement;
    const amountInput = document.getElementById("amount") as HTMLInputElement;
    const toInput = document.getElementById("to") as HTMLInputElement;

    const symbol = symbolInput.value;
    const amount = amountInput.value;
    const to = toInput.value;
    await doMintToken(symbol, amount, to);
  };

  const swapFeeToken = async () => {
    await doSwapFeeToken();
  };
  const queryToken = async () => {
    await doQueryToken("testiristoken");
  };
  const queryUnExistToken = async () => {
    await doQueryToken("testiristoken2323");
  };
  return (
    <main className="min-h-screen  p-24">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Symbol
        </label>
        <input
          type="text"
          id="symbol"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
          value={"moncxmtest"}
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
          required
          value={"100"}
        />
      </div>
      <br />
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          To
        </label>
        <input
          type="text"
          id="to"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
          value={"iaa1xt487wnadzuylgqg5ueajd3ahecg9r0mdt7pxs"}
        />
      </div>
      <br />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={mintToken}
      >
        mintToken
      </button>
      <br />
      <br />
      <hr />
      <br />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={swapFeeToken}
      >
        SwapFeeToken
      </button>
      &nbsp; &nbsp;
      {/* <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={queryToken}
      >
        成功的 query
      </button>
      &nbsp; &nbsp;
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={queryUnExistToken}
      >
        无法捕捉的 query
      </button> */}
    </main>
  );
}
