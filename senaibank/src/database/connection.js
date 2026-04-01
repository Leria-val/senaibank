import { Sequelize } from "sequelize";
import 'dotenv/config';

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASS, 
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres", 
    port: 5432,          
    logging: false,
  }
);

async function connect() {
  await sequelize.authenticate();
  console.log("conexão com PostgreSQL estabelecida.");
}

export { connect }; 
export default sequelize; 