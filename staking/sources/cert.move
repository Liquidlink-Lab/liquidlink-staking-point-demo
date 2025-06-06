module staking::cert {

    use iota::coin::{Self, Coin, create_currency};
    use iota::url::{Self, Url, new_unsafe_from_bytes};
    use iota::object::{Self, new};
    use iota::transfer::{Self, public_freeze_object, share_object};

    public struct CERT has drop {}

    const DECIMALS: u8 = 9;

    fun init(witness: CERT, ctx: &mut TxContext) {
        // create coin with metadata
        let (treasury_cap, metadata) = coin::create_currency<CERT>(
            witness, DECIMALS, b"sIOTA", b"Liquidlink Staked IOTA",
            b"sIOTA",
            option::none(),
            ctx
        );

        transfer::public_freeze_object(metadata);
        transfer::public_share_object(treasury_cap);
    }

    public(package) fun mint(
        treasury_cap: &mut coin::TreasuryCap<CERT>,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let coin = coin::mint(treasury_cap, amount, ctx);
        transfer::public_transfer(coin, recipient);
    }

    public(package) fun burn(
        treasury_cap: &mut coin::TreasuryCap<CERT>,
        coin: Coin<CERT>,
        ctx: &mut TxContext
    ) {
        coin::burn(treasury_cap, coin);
    }

    /// TEST ONLY ///
    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext){
        init(CERT{}, ctx); // Generate a OTW in current module
    }
}