module sui_nft::sui_nft;

use sui::display;
use sui::package;

/*
  Struct for defining the Sui NFT object type

  Abilities:
    - key: allows this type to be an object on Sui
    - store: allows this type to be freely transferrable by its owner and able to be wrapped in other objects

  Attributes:
    - id: The object id of this object (required when using key ability)

  Further reading:
    - key ability: https://move-book.com/storage/key-ability.html?highlight=key#the-key-ability
    - store ability: https://move-book.com/storage/store-ability.html?highlight=store#ability-store
*/
public struct SuiNFT has key, store {
    id: UID,
}

/*
  Module's one-time witness to be used for setting up the display standard for the Sui NFT type

  https://move-book.com/programmability/witness-pattern.html?highlight=one%20time#one-time-witness
*/
public struct SUI_NFT has drop {}

/*
  Init function that sets up the display standard for the Sui NFT object. This function will be called
  once and only once during the package deployment.

  Further reading:
    - Sui object display standard: https://docs.sui.io/standards/display
*/
fun init(otw: SUI_NFT, ctx: &mut TxContext) {
  let keys = vector[
    b"name".to_string(),
    b"image_url".to_string(),
    b"description".to_string(),
    b"project_url".to_string(),
  ];

  let values = vector[
    b"SUIIIII".to_string(),
    b"https://media.tenor.com/t3eKwU-odDgAAAAM/sui-siu.gif".to_string(),
    b"SUIIIII it out!".to_string(),
    b"https://github.com/sui-foundation/sui-object-model-workshop".to_string(),
  ];

  let publisher = package::claim(otw, ctx);

  let mut display = display::new_with_fields<SuiNFT>(&publisher, keys, values, ctx);

  display::update_version(&mut display);

  transfer::public_transfer(publisher, ctx.sender());
  transfer::public_transfer(display, ctx.sender());
}

/*
  Creates and returns a new SuiNFT object.
*/
public fun new(ctx: &mut TxContext): SuiNFT {
    SuiNFT { id: object::new(ctx) }
}
