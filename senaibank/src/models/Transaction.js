// Modelo para o extrato (saques, depósitos...)
const db = require("../database/connection");

class Transaction {

 static create(accountId, type, amount, callback) {

  const sql = `
   INSERT INTO transactions (account_id, type, amount)
   VALUES (?, ?, ?)
  `;

  db.query(sql, [accountId, type, amount], callback);
 }

 static getByAccount(accountId, callback) {

  db.query(
   "SELECT * FROM transactions WHERE account_id = ?",
   [accountId],
   callback
  );
 }

}

module.exports = Transaction;