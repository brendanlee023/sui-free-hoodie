import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import keyPairJson from "../keypair.json" with { type: "json" };
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { Transaction } from "@mysten/sui/transactions";

/**
 *
 * Global variables
 *
 * These variables are used throughout the exercise below.
 *
 */
const PACKAGE_ID = `0xb3491c9657444a947c97d7eeccff0d4988b432f8a37e7f9a26fb6ed4fbc3df9a`;
const COUNTER_OBJECT_ID = `0x8a6f2bc3af32c71a93a35d397fd47c14f67b7aa252002c907df9b172e95c0ec6`;

const keypair = Ed25519Keypair.fromSecretKey(keyPairJson.privateKey);

const suiClient = new SuiGrpcClient({
  network: "testnet",
  baseUrl: "https://fullnode.testnet.sui.io:443",
});

/**
 * Objects as input: Exercise 2
 *
 * In this exercise, you use Sui objects as inputs in a PTB to update the value of a shared object.
 *
 * When finished, run the following command in the scripts directory to test your solution:
 *
 * pnpm input-objects
 */
const main = async () => {
  /**
   * Task 1: Create a new Transaction instance.
   */
  const tx = new Transaction();

  /**
   * Task 2: Split a coin of 10 MIST from our gas coin to pay the counter increment fee.
   * The counter.move contract requires a minimum fee of 10.
   */
  const [feeCoin] = tx.splitCoins(tx.gas, [10]);

  /**
   * Task 3: Call `counter::increment` passing:
   *  - the shared counter object (by mutable reference)
   *  - the fee coin
   */
  tx.moveCall({
    target: `${PACKAGE_ID}::counter::increment`,
    arguments: [
      tx.object(COUNTER_OBJECT_ID),
      feeCoin,
    ],
  });

  /**
   * Task 4: Sign and execute the transaction.
   */
  const result = await suiClient.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
    options: {
      showEffects: true,
      showObjectChanges: true,
    },
  });

  const digest = (result as any).Transaction?.digest;
  console.log("✅ Transaction successful!");
  console.log(`Transaction digest: ${digest}`);
  console.log(`View on explorer: https://suiscan.xyz/testnet/tx/${digest}`);
};

main();