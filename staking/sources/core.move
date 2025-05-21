

module staking::core {

    use std::ascii::String;
    use iota::clock::Clock;
    use iota::iota::{IOTA};
    use iota::coin::{Self, Coin, TreasuryCap, join, split};

    use staking::cert::{Self, CERT};
    use liquidlink_protocol::point::{send_stake_point_req, send_unstake_point_req};

    public struct StakeWitness has drop {}

    public struct Vault has key, store {
        id: UID,
        coin: Coin<IOTA>
    }

    fun init(ctx: &mut TxContext) {
        let vault = Vault {
            id: object::new(ctx),
            coin: coin::zero<IOTA>(ctx)
        };

        transfer::public_share_object(vault);
    }

    public fun stake(
        action: String, 
        coin: Coin<IOTA>, 
        duration: u64, 
        clock:  &Clock, 
        treasury_cap: &mut TreasuryCap<CERT>, 
        vault: &mut Vault, 
        ctx: &mut TxContext
    ) {
        let weight = coin::value(&coin);
        // Transfer the coin to the treasury cap
        cert::mint(treasury_cap, weight, tx_context::sender(ctx), ctx);
        add_coin_vault(vault, coin);

        send_stake_point_req(
            &witness(),
            action, 
            weight as u256,
            duration,
            clock,
            ctx
        );
    }

    public fun unstake(action: String, coin: Coin<CERT>, duration: u64, clock:  &Clock, treasury_cap: &mut TreasuryCap<CERT>, vault: &mut Vault, ctx: &mut TxContext) {
        let weight = coin::value(&coin);

        cert::burn(treasury_cap, coin, ctx);
        let split_coin = remove_coin_vault(vault, weight, ctx);

        send_unstake_point_req(
            &witness(),
            action, 
            weight as u256,
            duration,
            clock,
            ctx
        );

        transfer::public_transfer(split_coin, tx_context::sender(ctx)); 
    }

    public(package) fun witness(): StakeWitness {
        StakeWitness {}
    }

    public(package) fun add_coin_vault(vault: &mut Vault, coin: Coin<IOTA>) {
        coin::join(&mut vault.coin, coin);
    }

    public(package) fun remove_coin_vault(vault: &mut Vault, split_amount: u64, ctx: &mut TxContext): Coin<IOTA> {
       let split_coin = coin::split(&mut vault.coin, split_amount, ctx);

       split_coin
    }
    
    /// TEST ONLY ///
    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext){
        init(ctx); // Generate a OTW in current module
    }
}
