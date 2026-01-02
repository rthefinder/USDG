use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;
pub mod errors;
pub mod events;

use instructions::*;
use state::*;

declare_id!("Guard1111111111111111111111111111111111111");

#[program]
pub mod oneguard {
    use super::*;

    /// Initialize a new launch with anti-snipe, anti-bundle, and anti-rug configurations
    pub fn initialize_launch(
        ctx: Context<InitializeLaunch>,
        config: LaunchConfigData,
    ) -> Result<()> {
        instructions::initialize_launch(ctx, config)
    }

    /// Revoke mint and freeze authorities (anti-rug enforcement)
    pub fn revoke_authorities(ctx: Context<RevokeAuthorities>) -> Result<()> {
        instructions::revoke_authorities(ctx)
    }

    /// Enable trading (after delay if configured)
    pub fn enable_trading(ctx: Context<EnableTrading>) -> Result<()> {
        instructions::enable_trading(ctx)
    }

    /// Execute a purchase with anti-snipe and anti-bundle checks
    pub fn purchase(ctx: Context<Purchase>, amount: u64) -> Result<()> {
        instructions::purchase(ctx, amount)
    }

    /// Initialize liquidity pool (records LP creation)
    pub fn initialize_lp(ctx: Context<InitializeLp>, lp_amount: u64) -> Result<()> {
        instructions::initialize_lp(ctx, lp_amount)
    }

    /// Finalize launch (immutable)
    pub fn finalize_launch(ctx: Context<FinalizeLaunch>) -> Result<()> {
        instructions::finalize_launch(ctx)
    }
}
