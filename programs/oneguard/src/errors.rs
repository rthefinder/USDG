use anchor_lang::prelude::*;

#[error_code]
pub enum OneguardError {
    #[msg("Max buy per wallet exceeded")]
    MaxBuyExceeded,
    
    #[msg("Trading not yet enabled")]
    TradingNotEnabled,
    
    #[msg("Trading already open")]
    TradingAlreadyOpen,
    
    #[msg("Launch already finalized")]
    LaunchFinalized,
    
    #[msg("Authorities already revoked")]
    AuthoritiesRevoked,
    
    #[msg("Authorities not yet revoked")]
    AuthoritiesNotRevoked,
    
    #[msg("Fair launch delay not elapsed")]
    FairLaunchDelayNotElapsed,
    
    #[msg("Bundle detected - one action per transaction")]
    BundleDetected,
    
    #[msg("Wallet concentration limit exceeded")]
    ConcentrationExceeded,
    
    #[msg("Purchase too soon after last purchase")]
    PurchaseTooSoon,
    
    #[msg("Unauthorized")]
    Unauthorized,
    
    #[msg("Invalid configuration")]
    InvalidConfig,
    
    #[msg("Fixed supply required")]
    FixedSupplyRequired,
    
    #[msg("Mint authority must be revoked")]
    MintAuthorityMustBeRevoked,
    
    #[msg("Freeze authority must be revoked")]
    FreezeAuthorityMustBeRevoked,
    
    #[msg("LP lock not yet expired")]
    LPLockNotExpired,
}
