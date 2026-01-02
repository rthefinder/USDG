use anchor_lang::prelude::*;

#[event]
pub struct LaunchInitialized {
    pub launch: Pubkey,
    pub creator: Pubkey,
    pub token_mint: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct AuthoritiesRevoked {
    pub launch: Pubkey,
    pub token_mint: Pubkey,
    pub mint_authority_revoked: bool,
    pub freeze_authority_revoked: bool,
    pub timestamp: i64,
}

#[event]
pub struct TradingEnabled {
    pub launch: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct PurchaseExecuted {
    pub launch: Pubkey,
    pub user: Pubkey,
    pub amount: u64,
    pub total_user_purchased: u64,
    pub total_launch_purchased: u64,
    pub timestamp: i64,
}

#[event]
pub struct LPInitialized {
    pub launch: Pubkey,
    pub lp_mint: Pubkey,
    pub lp_amount: u64,
    pub locked_until: Option<i64>,
    pub timestamp: i64,
}

#[event]
pub struct LaunchFinalized {
    pub launch: Pubkey,
    pub total_purchased: u64,
    pub participant_count: u64,
    pub timestamp: i64,
}
