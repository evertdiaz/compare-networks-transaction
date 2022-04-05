const algosdk = require('algosdk');
const prompt = require('prompt-sync')();

async function main() {
  // Input data to work with
  const sender = prompt('Sender account address: ');
  const accountKey = algosdk.mnemonicToSecretKey(prompt('Mnemonic phrase: ')).sk;
  const receiver = prompt('Receiver account address: ');

  // Connecting client
  const algodToken = '2f3203f21e738a1de6110eba6984f9d03e5a95d7a577b34616854064cf2c0e7b';
  const algodServer = 'https://academy-algod.dev.aws.algodev.network/';
  const algodPort = '';
  let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

  // Construct the transaction
  let params = await algodClient.getTransactionParams().do();
  params.fee = algosdk.ALGORAND_MIN_TX_FEE;
  params.flatFee = true;
  const enc = new TextEncoder();
  const note = enc.encode("Hello World");

  let txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: sender, 
      to: receiver, 
      amount: 1000000, // equals 1 ALGO
      note: note, 
      suggestedParams: params
  });

  // Sign the transaction
  let signedTxn = txn.signTxn(accountKey);
  let txId = txn.txID().toString();
  console.log("Signed transaction with txID: %s", txId);

  // Submit the transaction
  await algodClient.sendRawTransaction(signedTxn).do();

  // Wait for confirmation
  let confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);

  //Get the completed Transaction
  console.log("Transaction " + txId + " confirmed in round " + confirmedTxn["confirmed-round"]);
  let string = new TextDecoder().decode(confirmedTxn.txn.txn.note);
  console.log("Note field: ", string);
  accountInfo = await algodClient.accountInformation(sender).do();
  console.log("Transaction Amount: %d microAlgos", confirmedTxn.txn.txn.amt);        
  console.log("Transaction Fee: %d microAlgos", confirmedTxn.txn.txn.fee);
  console.log("Account balance: %d microAlgos", accountInfo.amount);
}

main()