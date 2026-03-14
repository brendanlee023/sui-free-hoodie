import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import keyPairJson from "../keypair.json" with { type: "json" };
import { SuiGrpcClient } from "@mysten/sui/grpc";

/**
 *
 * Global variables
 *
 * These variables are used throughout the exercise below.
 *
 */
const keypair = Ed25519Keypair.fromSecretKey(keyPairJson.privateKey);

const PACKAGE_ID = `0x9603a31f4b3f32843b819b8ed85a5dd3929bf1919c6693465ad7468f9788ef39`;
const VAULT_ID = `0x8d85d37761d2a4e391c1b547c033eb0e22eb5b825820cbcc0c386b8ecb22be33`;

const suiClient = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
});

/**
 * Scavenger Hunt: Exercise 3
 *
 * In this exercise, you use Sui objects as inputs in a PTB to update the value of a shared object.
 *
 * When finished, run the following command in the scripts directory to test your solution:
 *
 * pnpm scavenger-hunt
 *
 * RESOURCES:
 * - https://sdk.mystenlabs.com/typescript/transaction-building/basics#transactions
 */
const main = async () => {
  /**
   * Task 1:
   *
   * Create a new Transaction instance from the @mysten/sui/transactions module.
   */

  /**
   * Task 2:
   *
   * Create a new key using the `key::new` function.
   */

  /**
   * Task 3:
   *
   * Set the key code correctly using the `key::set_code` function.
   */

  /**
   * Task 4:
   *
   * Use the key to withdraw the `SUI` coin from the vault using the `vault::withdraw` function.
   */
  

  /**
   * Task 5:
   *
   * Transfer the `SUI` coin to your account.
   */


  /**
   * Task 6:
   *
   * Sign and execute the transaction using the SuiClient instance created above.
   *
   * Print the result to the console.
   *
   * Resources:
   * - Observing transaction results: https://sdk.mystenlabs.com/typescript/transaction-building/basics#observing-the-results-of-a-transaction
   */


  /**
   * Task 7: Run the script with the command below and ensure it works!
   * 
   * pnpm scavenger-hunt
   * 
   * Verify the transaction on the Sui Explorer: https://suiscan.xyz/testnet/home
   */
};

main();
