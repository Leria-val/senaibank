// Configuração do Express e junção das rotas
const express = require("express");

const accountRoutes = require("./routes/accountRoutes");
const bankRoutes = require("./routes/bankRoutes");

const app = express();

app.use(express.json());

app.use("/accounts", accountRoutes);
app.use("/bank", bankRoutes);

module.exports = app;