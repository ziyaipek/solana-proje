import { Connection, PublicKey, TransactionInstruction, Keypair, SystemProgram, LAMPORTS_PER_SOL, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import wallet from "./secretkey.json";
import * as readline from 'readline';
import { exec } from 'child_process';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Şarkı listesi
const songs: { name: string, link: string }[] = [
    { name: "Nothing Else Matters", link: "https://www.youtube.com/watch?v=tAGnKpE4NCI" },
    { name: "Stairway to Heaven", link: "https://www.youtube.com/watch?v=xbhCPt6PZIU" },
    { name: "Bohemian Rhapsody", link: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ" },
    { name: "Hotel California", link: "https://www.youtube.com/watch?v=CKjB00M2wHs" },
    { name: "Smells Like Teen Spirit", link: "https://www.youtube.com/watch?v=hTWKbfoikeg" },
    { name: "Sweet Child o' Mine", link: "https://www.youtube.com/watch?v=1w7OgIMMRc4" },
    { name: "Thunderstruck", link: "https://www.youtube.com/watch?v=v2AC41dglnM" },
    { name: "The Sound of Silence", link: "https://www.youtube.com/watch?v=4zLfCnGVeL4" },
    { name: "Back in Black", link: "https://www.youtube.com/watch?v=pAgnJDJN4VA" },
    { name: "Highway to Hell", link: "https://www.youtube.com/watch?v=l482T0yNkeo" }
];

// Seçilen şarkıyı belirlemek için seçenek menüsü
const selectSongMenu = (): Promise<{ name: string, link: string }> => {
    return new Promise((resolve, reject) => {
        console.log("Available Songs:");
        songs.forEach((song, index) => {
            console.log(`${index + 1}. ${song.name}`);
        });
        rl.question("Please select a song (Enter the song number):", (answer) => {
            const selectedSongIndex = parseInt(answer);
            const selectedSong = songs[selectedSongIndex - 1];
            console.log(`You selected: ${selectedSong.name}`);
            rl.close();
            resolve(selectedSong);
        });
    });
};

const connection = new Connection("https://api.devnet.solana.com");

const senderWallet = Keypair.fromSecretKey(Uint8Array.from(wallet.secretKey));

(async () => {
    try {
        const selectedSong = await selectSongMenu(); // Kullanıcının seçtiği şarkı

        const receiver_account = Keypair.generate() 
        const song_owner_account = Keypair.generate()
        const venue_owner_account = Keypair.generate()         
        const developer_account = Keypair.generate()

        const ix = SystemProgram.createAccount({
            fromPubkey: senderWallet.publicKey, //parasını kim ödeyecek, signer olması lazım
            newAccountPubkey: receiver_account.publicKey, //oluşturacağın hesap venue_owner
            lamports: LAMPORTS_PER_SOL * 0.1,
            space: 0,
            programId: SystemProgram.programId})

        const ix2 = SystemProgram.createAccount({
            fromPubkey: senderWallet.publicKey, 
            newAccountPubkey: song_owner_account.publicKey, 
            lamports: LAMPORTS_PER_SOL * 0.1,
            space: 0,
            programId: SystemProgram.programId})

        const ix3 = SystemProgram.createAccount({
            fromPubkey: senderWallet.publicKey, 
            newAccountPubkey: venue_owner_account.publicKey, 
            lamports: LAMPORTS_PER_SOL * 0.1,
            space: 0,
            programId: SystemProgram.programId})

        const ix4 = SystemProgram.createAccount({
            fromPubkey: senderWallet.publicKey, 
            newAccountPubkey: developer_account.publicKey, 
            lamports: LAMPORTS_PER_SOL * 0.1,
            space: 0,
            programId: SystemProgram.programId})

    // Şarkı işlem verisi

        const ix5 = new TransactionInstruction({
            keys: [
                { pubkey: senderWallet.publicKey, isSigner: true, isWritable: true },
                { pubkey: receiver_account.publicKey, isSigner: false, isWritable: true },
                { pubkey: song_owner_account.publicKey, isSigner: false, isWritable: true },
                { pubkey: venue_owner_account.publicKey, isSigner: true, isWritable: true },
                { pubkey: developer_account.publicKey, isSigner: false, isWritable: true },
            ],
            data: Buffer.from(`${selectedSong.name}: ${selectedSong.link}`, "utf-8"),
            programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
            
        })
            
        const message = new TransactionMessage({instructions:[ix, ix2, ix3, ix4, ix5], recentBlockhash:(await connection.getLatestBlockhash()).blockhash, payerKey:senderWallet.publicKey}).compileToV0Message()
        
        const transaction = new VersionedTransaction(message)
        
        transaction.sign([senderWallet, venue_owner_account])

        const signature = await connection.sendTransaction(transaction);
        console.log(`Transfer başarıyla tamamlandı. TX hash: ${signature}`);
        exec(`start ${selectedSong.link}`); // Şarkının linkini tarayıcıda aç
    } catch (error) {
        console.error("Transfer işlemi başarısız oldu:", error);
    }
})();