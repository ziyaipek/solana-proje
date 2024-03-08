use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
    sysvar::{self, Sysvar},
};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let sender_account = next_account_info(accounts_iter)?;
    let receiver_account = next_account_info(accounts_iter)?;
    let song_owner_account = next_account_info(accounts_iter)?;
    let venue_owner_account = next_account_info(accounts_iter)?;
    let developer_account = next_account_info(accounts_iter)?;

    // Ortak cüzdandaki miktar
    let shared_wallet_lamports = **sender_account.lamports().borrow();

    msg!("Shared wallet lamports: {}", shared_wallet_lamports);

    sender_account.try_borrow_mut_lamports()? -= song_owner_share;
    sender_account.try_borrow_mut_lamports()? -= venue_owner_share;;
    **sender_account.try_borrow_mut_lamports()? -= developer_share;

    // Paylaşılan miktarı şarkı sahibi, mekan sahibi ve uygulama geliştirici arasında böl
    let song_owner_share = shared_wallet_lamports / 3;
    let venue_owner_share = shared_wallet_lamports / 3;
    let developer_share = shared_wallet_lamports / 3;

    **song_owner_account.try_borrow_mut_lamports()? += song_owner_share;
    **venue_owner_account.try_borrow_mut_lamports()? += venue_owner_share;
    **developer_account.try_borrow_mut_lamports()? += developer_share;

    Ok(())
}
