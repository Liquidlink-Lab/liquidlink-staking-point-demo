#[test_only]
module staking::staking_tests {

    use iota::test_scenario::{Self, Scenario, EEmptyInventory};
    use iota::table;
    use iota::iota::{Self, IOTA};
    use iota::coin::{Self, Coin, TreasuryCap};
    use iota::clock::{Self, Clock, create_for_testing};
    use std::ascii::{Self, string, String};

    use staking::core::{Self, StakeWitness, Vault};
    use staking::cert::{Self, CERT};    

    const ADMIN: address = @0xA;
    const STAKER: address = @0xB;

    const ENotImplemented: u64 = 0;
    const EAssertFailed: u64 = 1;
    

    fun setup(): (Scenario, Clock) {
        let mut scenario = test_scenario::begin(ADMIN);
        let mut clock = clock::create_for_testing(scenario.ctx());

        {
            core::init_for_testing(scenario.ctx());
            cert::init_for_testing(scenario.ctx());
        };  
        

        (scenario, clock)
    }

    fun setup_coin(scenario: &mut Scenario, staker: address) {
        let test_coin = coin::mint_for_testing<IOTA>(1_000_000_000, scenario.ctx());
        transfer::public_transfer(test_coin, staker);
    }


    #[test]
    fun test_init() {
        let mut scenario = test_scenario::begin(ADMIN);
        
        {
            let ctx = test_scenario::ctx(&mut scenario);

            core::init_for_testing(ctx);
            cert::init_for_testing(ctx);
        };  
        
        scenario.next_tx(ADMIN);
        {
            assert!(test_scenario::has_most_recent_shared<Vault>(), 0);
            assert!(test_scenario::has_most_recent_shared<TreasuryCap<CERT>>(), 0);
        };
        
        scenario.end();
    }
    
    #[test]
    fun test_stake() {
        let (mut scenario, clock) = setup();
        setup_coin(&mut scenario, STAKER);

        let duration = 0;

        scenario.next_tx(STAKER);
        {
            let mut vault = scenario.take_shared<Vault>();
            let mut treasury_cap = scenario.take_shared<TreasuryCap<CERT>>();
            let coin = scenario.take_from_sender<Coin<IOTA>>();

            core::stake(string(b"test"), coin, duration, &clock, scenario.ctx(), &mut treasury_cap, &mut vault);

            test_scenario::return_shared(vault);
            test_scenario::return_shared(treasury_cap);
        };

        // Advance to the next transaction to access the minted CERT coin
        //! ONLY check the state after finished tx
        scenario.next_tx(STAKER);
        {
            let expected_cert = scenario.take_from_sender<Coin<CERT>>();
            assert!(coin::value(&expected_cert) == 1_000_000_000, EAssertFailed);

            test_scenario::return_to_sender(&scenario, expected_cert);
        };

        clock.destroy_for_testing();
        scenario.end();
    }

    #[test]
    #[expected_failure(abort_code = EEmptyInventory)]
    fun test_abort_stake_empty_iota_coin() {
        let (mut scenario, clock) = setup();
        setup_coin(&mut scenario, STAKER);

        let duration = 0;

        scenario.next_tx(STAKER);
        {
            let mut vault = scenario.take_shared<Vault>();
            let mut treasury_cap = scenario.take_shared<TreasuryCap<CERT>>();
            let coin = scenario.take_from_sender<Coin<IOTA>>();

            core::stake(string(b"test"), coin, duration, &clock, scenario.ctx(), &mut treasury_cap, &mut vault);

            test_scenario::return_shared(vault);
            test_scenario::return_shared(treasury_cap);
        };

        scenario.next_tx(STAKER);
        {   
            //! ERROR: Consumed all iota coin from previous staking tx
            let expected_cert = scenario.take_from_sender<Coin<IOTA>>();
            test_scenario::return_to_sender(&scenario, expected_cert);
        };

        clock.destroy_for_testing();
        scenario.end();
    }

    #[test]
    fun test_unstake() {
        let (mut scenario, clock) = setup();
        setup_coin(&mut scenario, STAKER);

        let duration = 0;

        scenario.next_tx(STAKER);
        {
            let mut vault = scenario.take_shared<Vault>();
            let mut treasury_cap = scenario.take_shared<TreasuryCap<CERT>>();
            let coin = scenario.take_from_sender<Coin<IOTA>>();

            core::stake(string(b"test"), coin, duration, &clock, scenario.ctx(), &mut treasury_cap, &mut vault);

            test_scenario::return_shared(vault);
            test_scenario::return_shared(treasury_cap);
        };

        scenario.next_tx(STAKER);
        {
            let mut vault = scenario.take_shared<Vault>();
            let mut treasury_cap = scenario.take_shared<TreasuryCap<CERT>>();
            let coin = scenario.take_from_sender<Coin<CERT>>();

            core::unstake(string(b"test"), coin, duration, &clock, scenario.ctx(), &mut treasury_cap, &mut vault);

            test_scenario::return_shared(vault);
            test_scenario::return_shared(treasury_cap);
        };

        scenario.next_tx(STAKER);
        {
            let expected_coin = scenario.take_from_sender<Coin<IOTA>>();
            assert!(coin::value(&expected_coin) == 1_000_000_000, EAssertFailed);

            test_scenario::return_to_sender(&scenario, expected_coin);
        };

        clock.destroy_for_testing();
        scenario.end();
    }

    #[test]
    #[expected_failure(abort_code = EEmptyInventory)]
    fun test_abort_unstake_empty_cert_coin() {
        let (mut scenario, clock) = setup();
        setup_coin(&mut scenario, STAKER);

        let duration = 0;

        scenario.next_tx(STAKER);
        {
            let mut vault = scenario.take_shared<Vault>();
            let mut treasury_cap = scenario.take_shared<TreasuryCap<CERT>>();
            let coin = scenario.take_from_sender<Coin<IOTA>>();

            core::stake(string(b"test"), coin, duration, &clock, scenario.ctx(), &mut treasury_cap, &mut vault);

            test_scenario::return_shared(vault);
            test_scenario::return_shared(treasury_cap);
        };

        scenario.next_tx(STAKER);
        {
            let mut vault = scenario.take_shared<Vault>();
            let mut treasury_cap = scenario.take_shared<TreasuryCap<CERT>>();
            let coin = scenario.take_from_sender<Coin<CERT>>();

            core::unstake(string(b"test"), coin, duration, &clock, scenario.ctx(), &mut treasury_cap, &mut vault);

            test_scenario::return_shared(vault);
            test_scenario::return_shared(treasury_cap);
        };

        scenario.next_tx(STAKER);
        {
            //! ERROR: Consumed all cert coin from previous unstaking tx    
            let expected_coin = scenario.take_from_sender<Coin<CERT>>();
            test_scenario::return_to_sender(&scenario, expected_coin);
        };

        clock.destroy_for_testing();
        scenario.end();
    }
}
