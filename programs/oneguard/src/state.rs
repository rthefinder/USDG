use anchor_lang::prelude::*;

#[account]
pub struct LaunchState {
    pub bump: u8,
    pub creator: Pubkey,
    pub token_mint: Pubkey,
    pub config: LaunchConfigData,
    pub phase: LaunchPhase,
    pub created_at: i64,
    pub launched_at: Option<i64>,
    pub finalized_at: Option<i64>,
    pub total_purchased: u64,
    pub participant_count: u64,
}

impl LaunchState {
    pub const LEN: usize = 8 + // discriminator
        1 + // bump
        32 + // creator
        32 + // token_mint
        LaunchConfigData::LEN + // config
        1 + // phase
        8 + // created_at
        9 + // launched_at (Option<i64>)
        9 + // finalized_at (Option<i64>)
        8 + // total_purchased
        8; // participant_count
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum LaunchPhase {
    Initialized,
    TradingRestricted,
    TradingOpen,
    Finalized,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct LaunchConfigData {
    pub anti_snipe: AntiSnipeConfig,
    pub anti_bundle: AntiBundleConfig,
    pub anti_rug: AntiRugConfig,
    pub usd1_config: USD1LaunchConfig,
}

impl LaunchConfigData {
    pub const LEN: usize = AntiSnipeConfig::LEN +
        AntiBundleConfig::LEN +
        AntiRugConfig::LEN +
        USD1LaunchConfig::LEN;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct AntiSnipeConfig {
    pub max_buy_per_wallet: u64,
    pub phased_unlock: bool,
    pub unlock_duration: Option<i64>,
    pub fair_launch_delay: Option<i64>,
}

impl AntiSnipeConfig {
    pub const LEN: usize = 8 + // max_buy_per_wallet
        1 + // phased_unlock
        9 + // unlock_duration (Option<i64>)
        9; // fair_launch_delay (Option<i64>)
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct AntiBundleConfig {
    pub detect_bundles: bool,
    pub max_wallet_concentration: u8,
    pub one_action_per_tx: bool,
}

impl AntiBundleConfig {
    pub const LEN: usize = 1 + // detect_bundles
        1 + // max_wallet_concentration
        1; // one_action_per_tx
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct AntiRugConfig {
    pub fixed_supply: bool,
    pub revoke_mint_authority: bool,
    pub revoke_freeze_authority: bool,
    pub lp_lock_duration: Option<i64>,
}

impl AntiRugConfig {
    pub const LEN: usize = 1 + // fixed_supply
        1 + // revoke_mint_authority
        1 + // revoke_freeze_authority
        9; // lp_lock_duration (Option<i64>)
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct USD1LaunchConfig {
    pub initial_price: u64,
    pub total_supply: u64,
    pub liquidity_amount: u64,
    pub creator_allocation: u64,
}

impl USD1LaunchConfig {
    pub const LEN: usize = 8 + // initial_price
        8 + // total_supply
        8 + // liquidity_amount
        8; // creator_allocation
}

#[account]
pub struct UserPurchaseState {
    pub bump: u8,
    pub launch: Pubkey,
    pub user: Pubkey,
    pub total_purchased: u64,
    pub purchase_count: u32,
    pub last_purchase_at: i64,
}

impl UserPurchaseState {
    pub const LEN: usize = 8 + // discriminator
        1 + // bump
        32 + // launch
        32 + // user
        8 + // total_purchased
        4 + // purchase_count
        8; // last_purchase_at
}

#[account]
pub struct LiquidityPoolState {
    pub bump: u8,
    pub launch: Pubkey,
    pub lp_mint: Pubkey,
    pub lp_amount: u64,
    pub locked_until: Option<i64>,
    pub created_at: i64,
}

impl LiquidityPoolState {
    pub const LEN: usize = 8 + // discriminator
        1 + // bump
        32 + // launch
        32 + // lp_mint
        8 + // lp_amount
        9 + // locked_until (Option<i64>)
        8; // created_at
}
