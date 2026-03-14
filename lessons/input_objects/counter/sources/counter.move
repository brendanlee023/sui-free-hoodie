module counter::counter;

use sui::balance;
use sui::coin;
use sui::sui::SUI;

/*
  Struct for defining the Counter object type

  Abilities:
    - key: allows this type to be an object on Sui

  Attributes:
    - id: The object id of this object (required when using key ability)
    - count: The current value of the counter
    - collected_fees: Balance of SUI tokens collected as fees
    - creator: Address of the creator of the counter
    - min_fee: Minimum fee required to increment the counter

  Further reading:
    - key ability: https://move-book.com/storage/key-ability/?highlight=key#the-key-ability
*/
public struct Counter has key {
    id: UID,
    count: u64,
    collected_fees: balance::Balance<SUI>,
    creator: address,
    min_fee: u64,
}

/*
  Init function that creates and shares a Counter object.

  This function will be called once and only once during the package deployment.

  Further reading:
    - Shared objects: https://docs.sui.io/concepts/object-ownership/shared
*/
fun init(ctx: &mut TxContext) {
  transfer::share_object(Counter {
    id: object::new(ctx),
    count: 0,
    collected_fees: balance::zero(),
    creator: ctx.sender(),
    min_fee: 10,
  });
}

/*
  Increment function that increases the counter value by 1.

  This function takes a mutable reference to a Counter object and a SUI coin as fee.
  The fee must be at least equal to the minimum fee set in the Counter object.
  The fee is added to the collected_fees balance in the Counter.

  Parameters:
    - counter: Mutable reference to the Counter object to increment
    - fee: SUI coin to pay as fee for incrementing

  Aborts:
    - If the fee is less than the minimum required fee
*/

public fun increment(counter: &mut Counter, fee: coin::Coin<SUI>) {
  counter.count = counter.count + 1;
  assert!(fee.value() >= counter.min_fee, 0);
  counter.collected_fees.join(fee.into_balance());
}
