import * as iris from "@irisnet/irishub-sdk";
import { Wallet } from "@irisnet/irishub-sdk/dist/src/types";
import long from "long";

interface IIrisAccountInfo {
  account: {
    typeUrl: string;
    value: {
      accountNumber: number;
      address: string;
      pubKey: {
        typeUrl: string;
        value: {
          key: string;
        };
      };
      sequence: number;
    };
  };
}
const chainId = "nyancat-9";
export const init = async () => {
  if (!window.getOfflineSigner || !window.keplr) {
    alert("Please install keplr extension");
  } else {
    if (window.keplr.experimentalSuggestChain) {
      try {
        await window.keplr.experimentalSuggestChain({
          chainId: chainId,
          chainName: "nyancat",
          rpc: "https://rpc.nyancat.rainbow.one/",
          rest: "https://lcd.nyancat.irisnet.org/",
          stakeCurrency: {
            coinDenom: "NYAN",
            coinMinimalDenom: "unyan",
            coinDecimals: 6,
          },
          bip44: {
            coinType: 118,
          },
          bech32Config: {
            bech32PrefixAccAddr: "iaa",
            bech32PrefixAccPub: "iaapub",
            bech32PrefixValAddr: "iaavaloper",
            bech32PrefixValPub: "iaavaloperpub",
            bech32PrefixConsAddr: "iaavalcons",
            bech32PrefixConsPub: "iaavalconspub",
          },
          currencies: [
            {
              coinDenom: "NYAN",
              coinMinimalDenom: "unyan",
              coinDecimals: 6,
            },
          ],
          feeCurrencies: [
            {
              coinDenom: "NYAN",
              coinMinimalDenom: "unyan",
              coinDecimals: 6,
            },
          ],
        });
      } catch (e) {
        alert("Failed to suggest the chain");
      }
    } else {
      alert("Please use the recent version of keplr extension");
    }
  }

  await window.keplr?.enable(chainId);
};

export async function doQueryToken(symbol: string) {
  const client = getClient();

  // client.token
  //   .queryToken(symbol)
  //   .then((res) => {
  //     console.log("in success");
  //     console.log(res);
  //   })
  //   .catch((e) => {
  //     console.log("in error");
  //     console.log(e);
  //   });

  try {
    const res = await client.token.queryToken(symbol);
    console.log("in success");
    console.log(res);
  } catch (e) {
    console.log("in error");
    console.error(e);
  }
}

export const doMintToken = async (
  symbol: string,
  priAmount: string,
  to?: string
) => {
  let amount = parseFloat(priAmount);
  amount *= 1000000;
  amount = Math.floor(amount);
  const token = { symbol, amount, to };
  const client = getClient();
  const account = await window.keplr?.getKey(chainId)!;
  const msgs: any[] = [
    {
      type: iris.types.TxType.MsgMintToken,
      value: Object.assign({ owner: account.bech32Address }, token),
    },
  ];
  console.log(msgs);

  let tx_o = await signMessage(client, account, msgs);
  let res = await client.tx.broadcast(tx_o, iris.types.BroadcastMode.Commit);
  console.log("res:", res);
};

export const transfer = async (recipient: string, priAmount: string) => {
  const client = getClient();

  let amount = parseFloat(priAmount);
  if (isNaN(amount)) {
    alert("Invalid amount");
    return false;
  }

  amount *= 1000000;
  amount = Math.floor(amount);
  await window.keplr?.enable(chainId);
  const account = await window.keplr?.getKey(chainId)!;

  console.log(account);
  const msgs = [
    {
      type: iris.types.TxType.MsgSend,
      value: {
        from_address: account.bech32Address,
        to_address: recipient,
        amount: [{ denom: "unyan", amount }],
      },
    },
  ];

  let tx_o = await signMessage(client, account, msgs);
  let res = await client.tx.broadcast(tx_o, iris.types.BroadcastMode.Commit);
  console.log("res:", res);

  return false;
};
async function signMessage(
  client: iris.Client,
  account: any,
  msgs: {
    type: iris.types.TxType;
    value: any;
  }[]
) {
  const accountInfo = (await client.auth.queryAccount(
    account.bech32Address
  )) as IIrisAccountInfo;
  let bTx = {} as unknown as iris.types.BaseTx;
  bTx.account_number = accountInfo.account.value.accountNumber;
  bTx.sequence = accountInfo.account.value.sequence;

  console.log({ bTx });

  let tx_o = client.tx.buildTx(msgs, bTx);
  tx_o.setPubKey(
    Buffer.from(account.pubKey).toString("hex"),
    accountInfo.account.value.sequence
  );
  let signDoc = tx_o.getSignDoc(bTx.account_number, chainId);

  let keplr_signDoc_obj = {
    bodyBytes: signDoc.getBodyBytes(),
    authInfoBytes: signDoc.getAuthInfoBytes(),
    chainId: chainId,
    accountNumber: new long(signDoc.getAccountNumber()),
  };
  let s = await window.keplr?.signDirect(
    keplr_signDoc_obj.chainId,
    account.bech32Address,
    keplr_signDoc_obj
  )!;
  tx_o.addSignature(s.signature.signature);
  tx_o.authInfo = iris.types.tx_tx_pb.AuthInfo.deserializeBinary(
    s.signed.authInfoBytes
  );
  tx_o.body = iris.types.tx_tx_pb.TxBody.deserializeBinary(s.signed.bodyBytes);
  return tx_o;
}

function getClient() {
  let config = {
    node: "https://rpc.nyancat.rainbow.one",
    chainId: chainId,
  };

  const client = iris
    .newClient(config)
    .withKeyDAO({
      write: () => {},
      read: () => {
        return "" as unknown as Wallet;
      },
    })
    .withRpcConfig({ timeout: 90000 });
  return client;
}
