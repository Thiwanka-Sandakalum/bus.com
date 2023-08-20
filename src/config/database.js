const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_FILE_PATH, // Replace 'DB_FILE_PATH' with the path to your SQLite database file
});

// const sequelize = new Sequelize('bus-db','thiwa','2002', {
//     host: 'localhost',
//     dialect: 'mysql'
// });

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

// Call the testConnection function to check the database connection
testConnection();

module.exports = { testConnection, sequelize };


// const { Sequelize } = require('sequelize');
// require('dotenv').config();

// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialect: 'postgres',
//   protocol: 'postgres',
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false // You might need this depending on your PostgreSQL setup
//     }
//   }
// });

// async function testConnection() {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// }

// // Call the testConnection function to check the database connection
// testConnection();

// module.exports = { testConnection, sequelize };
