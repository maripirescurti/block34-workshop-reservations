const { 
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  fetchReservations
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
  console.log(await fetchCustomers());
  console.log(await fetchRestaurants());

  const [reservation, reservation2] = await Promise.all([
    createReservation({
      customer_id: mari.id,
      restaurant_id: rosemary.id,
      date: '02/14/2024'
    }),
    createReservation({
      customer_id: mari.id,
      restaurant_id: rosemary.id,
      date: '02/28/2024'
    }),
  ]);
  console.log(await fetchReservations())
};

init ();