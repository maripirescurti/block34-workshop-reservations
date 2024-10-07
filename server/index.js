const { 
  client,
  createTables,
} = require('./db');

const init = async() => {
  console.log('connecting to databse');
  await client.connect();
  console.log('connected to database');
  await createTables();
  console.log('created tables');
};

init ();