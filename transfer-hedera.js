const { Client, AccountId, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar, TransferTransaction} = require("@hashgraph/sdk");
const prompt = require('prompt-sync')();

require("dotenv").config();

async function main() {
  // Receive data from sender
  const sender = prompt('Sender account: ');
  const accountKey = PrivateKey.fromString(prompt('Private Key: '));

  // We build the client operator for transaction
  const client = Client.forTestnet();
  client.setOperator(sender, accountKey);

  // Extra data for the transaction
  const receiver = prompt('Receiver account: ');
  const amount = prompt('Amount of HBar: ');

  // Create the transaction
  const transaction = await new TransferTransaction()
  .addHbarTransfer(sender, new Hbar(amount*-1))
  .addHbarTransfer(receiver, new Hbar(amount))

  // Submit transaction to Hedera
  const txResponse = await transaction.execute(client);

  // Request result of transaction
  const receipt = await txResponse.getReceipt(client);
  console.log("The transaction consensus status is " +receipt.status.toString());
}

main();