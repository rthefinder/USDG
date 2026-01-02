use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::OneguardError;
use crate::events::PurchaseExecuted;

#[derive(Accounts)]
pub struct Purchase<'info> {
    #[account(
        mut,
        seeds = [b"launch", launch.token_mint.as_ref()],
        bump = launch.bump
    )]
    pub launch: Account<'info, LaunchState>,
    
    #[account(
        init_if_needed,
        payer = user,
        space = UserPurchaseState::LEN,
        seeds = [b"user_purchase", launch.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub user_purchase: Account<'info, UserPurchaseState>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn purchase(ctx: Context<Purchase>, amount: u64) -> Result<()> {
    let launch = &mut ctx.accounts.launch;
    let user_purchase = &mut ctx.accounts.user_purchase;
    let clock = Clock::get()?;

    // Check trading is enabled
    require!(
        launch.phase == LaunchPhase::TradingRestricted || launch.phase == LaunchPhase::TradingOpen,
        OneguardError::TradingNotEnabled
    );

    require!(
        launch.phase != LaunchPhase::Finalized,
        OneguardError::LaunchFinalized
    );

    // Initialize user purchase state if needed
    if user_purchase.total_purchased == 0 {
        user_purchase.bump = ctx.bumps.user_purchase;
        user_purchase.launch = launch.key();
        user_purchase.user = ctx.accounts.user.key();
        user_purchase.total_purchased = 0;
        user_purchase.purchase_count = 0;
        user_purchase.last_purchase_at = 0;
    }

    // Anti-snipe check: max buy per wallet
    let new_total = user_purchase.total_purchased.checked_add(amount)
        .ok_or(OneguardError::MaxBuyExceeded)?;
    
    require!(
        new_total <= launch.config.anti_snipe.max_buy_per_wallet,
        OneguardError::MaxBuyExceeded
    );

    // Anti-bundle check: prevent rapid successive purchases (coordinated bundles)
    if launch.config.anti_bundle.one_action_per_tx {
        // This is enforced at transaction level - only one purchase instruction allowed
        let time_since_last = clock.unix_timestamp - user_purchase.last_purchase_at;
        // Require at least 1 second between purchases from same wallet
        if user_purchase.purchase_count > 0 {
            require!(time_since_last >= 1, OneguardError::PurchaseTooSoon);
        }
    }

    // Anti-bundle check: wallet concentration
    let total_supply = launch.config.usd1_config.total_supply;
    let wallet_percentage = (new_total as f64 / total_supply as f64) * 100.0;
    require!(
        wallet_percentage <= launch.config.anti_bundle.max_wallet_concentration as f64,
        OneguardError::ConcentrationExceeded
    );

    // Update states
    user_purchase.total_purchased = new_total;
    user_purchase.purchase_count += 1;
    user_purchase.last_purchase_at = clock.unix_timestamp;

    if user_purchase.purchase_count == 1 {
        launch.participant_count += 1;
    }

    launch.total_purchased = launch.total_purchased.checked_add(amount)
        .ok_or(OneguardError::MaxBuyExceeded)?;

    emit!(PurchaseExecuted {
        launch: launch.key(),
        user: ctx.accounts.user.key(),
        amount,
        total_user_purchased: user_purchase.total_purchased,
        total_launch_purchased: launch.total_purchased,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}
