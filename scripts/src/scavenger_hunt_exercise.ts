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

const PACKAGE_ID = `0x9603a31f4b3f32843b819b8ed85a5dd3929bf1919c6693465ad7468f9788ef39`;
const VAULT_ID = `0x8d85d37761d2a4e391c1b547c033eb0e22eb5b825820cbcc0c386b8ecb22be33`;

const suiClient = new SuiGrpcClient({
  network: "testnet",
  baseUrl: "https://fullnode.testnet.sui.io:443",
});

/**
 * Scavenger Hunt: Exercise 3
 *
 * Steps:
 * 1. Fetch the vault object to read its key_code field
 * 2. Create a Key object
 * 3. Set the key code to match the vault's key_code
 * 4. Withdraw SUI from the vault using the key
 * 5. Transfer the SUI coin to our address
 */
const main = async () => {
  /**
   * Fetch the vault object fields to get the required key_code.
   * Use the Sui JSON-RPC directly since SuiGrpcClient doesn't support getObject.
   */
  const rpcResponse = await fetch("https://fullnode.testnet.sui.io:443", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "sui_getObject",
      params: [VAULT_ID, { showContent: true }],
    }),
  });
  const rpcData = await rpcResponse.json();
  const fields = rpcData?.result?.data?.content?.fields;
  const keyCode: number = fields?.code;

  if (keyCode === undefined) {
    throw new Error(`Could not read code from vault object. Fields: ${JSON.stringify(fields)}`);
  }

  console.log(`🔑 Vault code: ${keyCode}`);

  /**
   * Task 1: Create a new Transaction instance.
   */
  const tx = new Transaction();

  /**
   * Task 2: Create a new Key using `key::new`.
   */
  const key = tx.moveCall({
    target: `${PACKAGE_ID}::key::new`,
  });

  /**
   * Task 3: Set the key code using `key::set_code`.
   * key::set_code takes &mut Key - pass the result directly.
   */
  tx.moveCall({
    target: `${PACKAGE_ID}::key::set_code`,
    arguments: [
      key,
      tx.pure.u64(keyCode),
    ],
  });

  /**
   * Task 4: Withdraw SUI from the vault using `vault::withdraw`.
   * vault is a shared object (Vault<SUI>), key is passed by value.
   * We need the type argument for the generic Vault<T>.
   */
  const [coin] = tx.moveCall({
    target: `${PACKAGE_ID}::vault::withdraw`,
    typeArguments: ["0x2::sui::SUI"],
    arguments: [
      tx.object(VAULT_ID),
      key,
    ],
  });

  /**
   * Task 5: Transfer the withdrawn SUI coin to our address.
   */
  tx.transferObjects([coin], suiAddress);

  /**
   * Task 6: Sign and execute the transaction.
   */
  const result = await suiClient.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
    options: {
      showEffects: true,
      showBalanceChanges: true,
      showObjectChanges: true,
    },
  });

  const digest = (result as any).Transaction?.digest;
  console.log("✅ Transaction successful!");
  console.log(`Transaction digest: ${digest}`);
  console.log(`View on explorer: https://suiscan.xyz/testnet/tx/${digest}`);
};

main();