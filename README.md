# Sui Object Model and PTBs Workshop

When learning Sui Move, developers are encouraged to use best practices to utilize the Sui object model and ensure on-chain object composability. Developers learn to write composable move code in a timely manner, but struggle to verify their code by deploying and executing the functionality on chain. The key to mastering the Sui object model is to pair your Sui move development sessions with interacting with on-chain objects via PTBs (Programmable Transaction Blocks). This workshop will guide you through the process of writing Sui Move code, deploying it to the Sui blockchain, and interacting with on-chain objects via PTBs.

# Table of Contents

- [Sui Object Model and PTBs Workshop](#sui-object-model-and-ptbs-workshop)
- [Table of Contents](#table-of-contents)
- [Getting Started](#getting-started)
  - [Create Your Own Copy of This Repo](#create-your-own-copy-of-this-repo)
  - [Environment Setup](#environment-setup)
  - [Getting testing credits](#getting-testing-credits)
- [Lessons](#lessons)
  - [Lesson 1: Handling Returned Objects](#lesson-1-handling-returned-objects)
    - [Exercise 1: Handling Returned Sui NFT](#exercise-1-handling-returned-sui-nft)
  - [Lesson 2: Objects as Input](#lesson-2-objects-as-input)
    - [Exercise 2: Input Objects - Counter](#exercise-2-input-objects---counter)
  - [Lesson 3: Putting it together](#lesson-3-putting-it-together)
    - [Exercise 3: Scavenger Hunting with PTBs](#exercise-3-scavenger-hunting-with-ptbs)

# Getting Started

## Create Your Own Copy of This Repo

> **Important:** Do NOT clone or fork this repository directly. Instead, create a **template copy** so you have your own independent repo to work in.

1. At the top of this repository's GitHub page, click the **"Use this template"** button (top-right corner).
2. Select **"Create a new repository"**.
3. Give your repo a name, and **make sure it is set to Public**.
4. Click **"Create repository"**.
5. Clone your newly created repository to your local machine:

```bash
git clone <your-new-repo-url>
cd <your-new-repo-name>
```

## Environment Setup

Now that you have your own copy, set up your environment and create a keypair for interacting with the Sui blockchain.

### Prerequisites

- Node.js (v18 or higher recommended)
- pnpm package manager

### Setup Instructions

1. Navigate to the `scripts` directory:

```bash
cd scripts
```

1. Install dependencies:

```bash
pnpm install
```

1. Generate and fund a new keypair:

```bash
pnpm init-keypair
```

This will generate a new Ed25519 keypair and save it to `keypair.json` in the scripts directory. **Make sure not to use this keypair in any production environments.**

## Getting testing credits

If you are at a hackathon or workshop event, ask your Sui rep for a dedicated faucet (or check the track details). Otherwise, use the [Official Sui faucet](https://faucet.sui.io/).

You can view your account and balance on the Sui Explorer at:

```
https://suiscan.xyz/testnet/account/{your-address}
```

# Lessons

## Lesson 1: Handling Returned Objects

One of the best practices when writing Sui Move packages is to avoid self-transfers. In other words, avoid transferring objects to the sender of the transaction, and instead return the object from the current function. This allows a caller or programmable transaction block to use the object however they see fit. 

For example, avoid this: 

```move

public struct NewObject has key, store {
  id: UID
}

public fun new(ctx: &mut TxContext) {
  let new_object = NewObject{
    id: object::new(ctx),
  };

  transfer::transfer(new_object, ctx.sender());
}
  
```

Instead, do this:

```move

public struct NewObject has key, store {
  id: UID
}

public fun new(ctx: &mut TxContext): NewObject {
  let new_object = NewObject{
    id: object::new(ctx),
  };

  new_object
}
  
```

This is easy enough to do, but in most cases (when the object doesn't have the `[drop` ability](https://move-book.com/reference/abilities.html?highlight=drop#drop)), if the returned object is not handled properly, the transaction will fail.

In this lesson, you learn how to handle returned objects properly.

### Exercise 1: Handling Returned Sui NFT

The package of the SUIII NFT is at `[0x57e029acbe322c733c1936ccba3642f27d0525c3883cf4e2742053ba2c5490b0](https://suiscan.xyz/testnet/object/0x57e029acbe322c733c1936ccba3642f27d0525c3883cf4e2742053ba2c5490b0/tx-blocks)` and the NFT object type is `[0x57e029acbe322c733c1936ccba3642f27d0525c3883cf4e2742053ba2c5490b0::sui_nft::SuiNFT](https://suiscan.xyz/testnet/collection/0x57e029acbe322c733c1936ccba3642f27d0525c3883cf4e2742053ba2c5490b0::sui_nft::SuiNFT/items)`.

View the contract at `[sui_nft.move](./lessons/returning_objects/sui_nft/sources/sui_nft.move)`. Try to mint an NFT to your account and view it at explorer with PTBs.

Navigate to `[scripts/src/return_objects_exercise.ts](./scripts/src/return_objects_exercise.ts)` and complete the exercise.

## Lesson 2: Objects as Input

There are a lot of situations where one will want to interact with objects on Sui. Referencing and using objects in Sui Move is simple but nuanced. To reference an object in Sui Move, make the object a function parameter. For example, 

```move
public struct SimpleObject has key, store {
  id: UID, 
  value: u64 
}

public fun update_value(obj: &mut SimpleObject, new_value: u64) {
  obj.value = new_value;
}

public fun delete(obj: SimpleObject) {
  let SimpleObject {
    id, 
    value: _,
  } = obj;

  id.delete();
}
```

The `update_value` function receives the mutable reference of the `SimpleObject` and updates one of its attributes. Note that it receives only the mutable reference, therefore, the object doesn't need to be returned at the end of the function. 

The `delete` function receives the actual instance of the `SimpleObject` and deletes it by destructuring it. An object can only be destructured in the moduel that originally defined the object type. Since the object is destrutured, it does not need to be returned at the end of the function. 

This usage is straightforward, but tends to leave developers wondering what this looks out in a wider context. In this lesson, you learn how to use objects as inputs in PTBs. 

### Exercise 2: Input Objects - Counter

View the contents `[counter.move](./lessons/input_objects/counter/sources/counter.move)`. There is a deployed instance of this package on the Sui blockchain. The address of the package is `[0xb3491c9657444a947c97d7eeccff0d4988b432f8a37e7f9a26fb6ed4fbc3df9a](https://suiscan.xyz/testnet/object/0xb3491c9657444a947c97d7eeccff0d4988b432f8a37e7f9a26fb6ed4fbc3df9a/txs)` and the counter object is [0x8a6f2bc3af32c71a93a35d397fd47c14f67b7aa252002c907df9b172e95c0ec6](https://suiscan.xyz/testnet/object/0x8a6f2bc3af32c71a93a35d397fd47c14f67b7aa252002c907df9b172e95c0ec6/fields).

Navigate to `[scripts/src/input_objects_exercise.ts](./scripts/src/input_objects_exercise.ts)` and complete the exercise.

## Lesson 3: Putting it together

### Exercise 3: Scavenger Hunting with PTBs

In this exercise, you will try to get the `SUI` coin in Testnet from the vault using a key created by PTBs. The deployed contract is at `[0x9603a31f4b3f32843b819b8ed85a5dd3929bf1919c6693465ad7468f9788ef39](https://suiscan.xyz/testnet/object/0x9603a31f4b3f32843b819b8ed85a5dd3929bf1919c6693465ad7468f9788ef39/contracts)`.

Navigate to `[scavenger](./lessons/scavenger)` to read the smart contract code.

You will need to create a PTB to:

1. Create a key
2. Set the key code correctly (Hint: You can view the on-chain vault object fields [https://suiscan.xyz/testnet/object/0x8d85d37761d2a4e391c1b547c033eb0e22eb5b825820cbcc0c386b8ecb22be33/fields](https://suiscan.xyz/testnet/object/0x8d85d37761d2a4e391c1b547c033eb0e22eb5b825820cbcc0c386b8ecb22be33/fields))
3. Use the key to withdraw the `SUI` coin from the vault
4. Transfer the `SUI` coin to your account

Navigate to `[scripts/src/scavenger_hunt_exercise.ts](./scripts/src/scavenger_hunt_exercise.ts)` and complete the exercise.