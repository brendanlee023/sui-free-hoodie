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
const suiAddress = keypair.getPublicKey().toSuiAddress();

const PACKAGE_ID = `0x57e029acbe322c733c1936ccba3642f27d0525c3883cf4e2742053ba2c5490b0`;

const suiClient = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
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
   * Execute the call to the `sui_nft::new` function to the transaction instance.
   *
   * The target should be in the format {package address}::{module name}::{function name}. The
   * package address is provided above. The module name is `sui_nft` and the function name is `new`.
   *
   * HINT: The arguments and typeArguments arguments are optional since this function does not take
   * any arguments or type arguments.
   */

  /**
   * Task 3:
   *
   * Transfer the newly created SuiNFT object to your address.
   *
   * Use `tx.transferObjects(objects, address)` - Transfers a list of objects to the specified address.
   *
   * HINT: Use `suiAddress`` to transfer the object to your address.
   */


  /**
   * Task 4:
   *
   * Sign and execute the transaction using the SuiClient instance created above.
   *
   * Print the result to the console.
   */


  /**
   * Task 5: Run the script with the command below and ensure it works!
   * 
   * pnpm return-objects
   * 
   * Verify the transaction on the Sui Explorer: https://suiscan.xyz/testnet/home
   */
};

main();
