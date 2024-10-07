const { 
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  fetchReservations,
  destroyReservation,
} = require('./db');

const express = require ('express');
const app = express();

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
  console.log(await fetchReservations());
  await destroyReservation({ id: reservation.id, customer_id: reservation.customer_id});
  console.log(await fetchReservations());

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
    console.log('some curl commands to test');
    console.log(`curl localhost: ${port}/api/customers`);
    console.log(`curl localhost: ${port}/api/restaurants`);
    console.log(`curl localhost: ${port}/api/reservations`);
  });
};

init ();