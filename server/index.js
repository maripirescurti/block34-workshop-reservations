const { 
  client,
  createTables,
  createCustomer,
  createRestaurant,
} = require('./db');

const init = async() => {
  console.log('connecting to databse');
  await client.connect();
  console.log('connected to database');
  await createTables();
  console.log('created tables');
  const [mari, ozan, simba, nala, rosemary, rangoon, apollo] = await Promise.all([
    createCustomer({ name: 'mari'}),
    createCustomer({ name: 'ozan'}),
    createCustomer({ name: 'simba'}),
    createCustomer({ name: 'nala'}),
    createRestaurant({ name: 'rosemary'}),
    createRestaurant({ name: 'rangoon'}),
    createRestaurant({ name: 'apollo'}),
  ]);
};

init ();