import { Keypair } from "@solana/web3.js";
import fs from "fs";

// Yeni bir keypair oluştur
let kp = Keypair.generate();
  
// Secret key'i Uint8Array olarak al
const secretKeyArray = Array.from(kp.secretKey);

// JSON formatına dönüştür
const jsonData = JSON.stringify({
    publicKey: kp.publicKey.toBase58(),
    secretKey: secretKeyArray
}, null, 2);

// Dosyaya yaz
fs.writeFileSync('secretkey.json', jsonData);

console.log(`You've generated a new Solana wallet:`);
console.log(`Public key: ${kp.publicKey.toBase58()}`);
console.log(`Secret key: [${secretKeyArray.join(',')}]`);
