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
const keypair = Ed25519Keypair.fromSecretKey(keyPairJson.privateKey);
const suiAddress = keypair.getPublicKey().toSuiAddress();

const PACKAGE_ID = `0x57e029acbe322c733c1936ccba3642f27d0525c3883cf4e2742053ba2c5490b0`;

const suiClient = new SuiGrpcClient({
  network: "testnet",
  baseUrl: "https://fullnode.testnet.sui.io:443",
});

/**
 * Returning Objects: Exercise 1
 *
 * In this exercise, you will be returned a new object from a function and must transfer it to an
 * address, otherwise, the transaction will abort.
 *
 * When finished, run the following command in the scripts directory to test your solution:
 *
 * pnpm return-objects
 */
const main = async () => {
  /**
   * Task 1: Create a new Transaction instance.
   */
  const tx = new Transaction();

  /**
   * Task 2: Call `sui_nft::new` - this returns a SuiNFT object.
   */
  const [nft] = tx.moveCall({
    target: `${PACKAGE_ID}::sui_nft::new`,
  });

  /**
   * Task 3: Transfer the returned NFT object to our address.
   * If we don't handle the returned object, the transaction will abort.
   */
  tx.transferObjects([nft], suiAddress);

  /**
   * Task 4: Sign and execute the transaction.
   */
  const result = await suiClient.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
    options: {
      showObjectChanges: true,
      showEffects: true,
    },
  });

  const digest = (result as any).Transaction?.digest;
  console.log("✅ Transaction successful!");
  console.log(`Transaction digest: ${digest}`);
  console.log(`View on explorer: https://suiscan.xyz/testnet/tx/${digest}`);
};

main();