// imports
const { 
  client,
  createTables,
  createCustomer,
  createRestaurant,
  createReservation,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  destroyReservation
} = require('./db');

const express = require ('express');
const app = express();
app.use(express.json());

// APP ROUTES
// get - read
app.get('/api/customers', async(req, res, next) => {
  try {
    res.send(await fetchCustomers());
  } catch(ex) {
    next(ex);
  }
});

app.get('/api/restaurants', async(req, res, next) => {
  try {
    res.send(await fetchRestaurants());
  } catch(ex) {
    next(ex);
  }
});

app.get('/api/reservations', async(req, res, next) => {
  try {
    res.send(await fetchReservations());
  } catch(ex) {
    next(ex);
  }
});

// delete
app.delete('/api/customers/:customer_id/reservations/:id', async(req, res, next) => {
  try {
    await destroyReservation({
      customer_id: req.params.customer_id, 
      id: req.params.id
    });
    res.sendStatus(204);
  } catch(ex) {
    next (ex);
  }
});

// post - create
app.post('/api/customers/:customer_id/reservations', async(re, res, next) => {
  try {
    res.status(201).send(await createReservation({
      customer_id: req.params.customer_id, 
      restaurant_id: req.body.restaurant_id, 
      date: req.body.date,
      party_count: req.body.party_count,
    }));
  } catch(ex) {
    next(ex);
  }
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ error: err.message || err});
});

// init function
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
    console.log(`curl -X DELETE localhost: ${port}/api/customers/${mari.id}/reservations/${reservation2.id}`);
    console.log(`curl -X POST localhost: ${port}/api/customers/${mari.id}/reservations/ -d '{"restaurant_id":"${rosemary.id}", "date": "02/15/2025"}' -H "Content-Type:application/json"`);
  });
};

init ();