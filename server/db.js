const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_travel_db');
const uuid = require('uuid');

const createTables = async() => {
  const SQL = `
    DROP TABLE IF EXISTS reservations;
    DROP TABLE IF EXISTS customers;
    DROP TABLE IF EXISTS restaurants;
    CREATE TABLE customers(
      id UUID PRIMARY KEY,
      name VARCHAR(50) NOT NULL UNIQUE
    );
    CREATE TABLE restaurants(
      id UUID PRIMARY KEY,
      name VARCHAR(50) NOT NULL UNIQUE
    );
    CREATE TABLE reservations(
      id UUID PRIMARY KEY,
      date DATE NOT NULL,
      party_count INTEGER NOT NULL,
      restaurant_id UUID REFERENCES restaurants table NOT NULL,
      customer_id UUID REFERENCES customer table NOT NULL
    );
  `;
  await client.query(SQL);
};

const createCustomer = async(name)=> {
  const SQL = `
    INSERT INTO users(id, name)
    VALUES($1, $2)
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

const createRestaurant = async(name)=> {
  const SQL = `
    INSERT INTO users(id, name)
    VALUES($1, $2)
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurant,
};