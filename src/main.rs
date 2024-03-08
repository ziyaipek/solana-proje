use reqwest::blocking::Client;
use serde_json::json;

fn main() {
    let rpc_endpoint = "https://api.devnet.solana.com";

    let method = "getConfirmedSignaturesForAddress2";
    let wallet_address = "Edr5CqP2svm77Bu9sHu2oWt7Q814YjJMCopkXKsB6iNE";
    let limit = 3; // Kaç işlem almak istediğimiz

    // RPC isteği oluşturma
    let client = Client::new();
    let response = client
        .post(rpc_endpoint)
        .json(&json!({
            "jsonrpc": "2.0",
            "id": 1,
            "method": method,
            "params": [
                wallet_address,
                {
                    "limit": limit
                }
            ]
        }))
        .send();

    match response {
        Ok(res) => {
            if res.status().is_success() {
                let json_body: serde_json::Value = res.json().unwrap();
                println!("{:#?}", json_body);
            } else {
                println!("Error: {}", res.status());
            }
        }
        Err(e) => {
            println!("Error: {:?}", e);
        }
    }
}
