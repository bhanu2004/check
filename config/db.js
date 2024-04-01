import {Sequelize} from 'sequelize';
// const sequelize = new Sequelize('sqlite::memory:') // Example for sqlite
// const sequelize = new Sequelize('postgres://postgres:root@example.com:5432/dbname')

const sequelize = new Sequelize('postgres', 'postgres', 'root', {
    host: 'localhost',
    dialect: 'postgres' 
  });

  sequelize
  .authenticate()
  .then(() => {
    console.info("Successfully connected to database");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
    });


  sequelize
  .sync({alter:false})
  .then(() => {
    console.log("synced to respective Table.");
  })
  .catch((err) => {
    console.log("error in syncing to tables", err);
  });

// console.log("Database is created");


export default sequelize;