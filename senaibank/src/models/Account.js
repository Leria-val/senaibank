// Modelo da conta (nome, cpf, saldo...)
const connection = require("../database/connection");

class Account {

  static create(data, callback) {
    const sql = `
      INSERT INTO accounts (name, cpf, email, balance)
      VALUES (?, ?, ?, 0)
    `;

    connection.query(
      sql,
      [data.name, data.cpf, data.email],
      callback
    );
  }

  static findAll(callback) {
    connection.query(
      "SELECT * FROM accounts",
      callback
    );
  }

  static findById(id, callback) {
    connection.query(
      "SELECT * FROM accounts WHERE id = ?",
      [id],
      callback
    );
  }

  static update(id, data, callback) {
    const sql = `
      UPDATE accounts
      SET name = ?, email = ?
      WHERE id = ?
    `;

    connection.query(
      sql,
      [data.name, data.email, id],
      callback
    );
  }

  static delete(id, callback) {
    connection.query(
      "DELETE FROM accounts WHERE id = ?",
      [id],
      callback
    );
  }

}

module.exports = Account;