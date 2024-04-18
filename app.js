const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  user: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'nmgdb',
  password: '123456789',
  port: 5432,
});

app.use(express.json());

const getColumns = async (client, table) => {
  const { rows } = await client.query(`SELECT column_name, is_nullable, is_identity FROM information_schema.columns WHERE table_name = $1`, [table]);
  return rows.map(row => ({ name: row.column_name, isNullable: (row.is_nullable === 'YES' || row.is_identity === 'YES') }));
};

const getExistance = async (client, tableName) => {
  const { rows } = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
  return rows.some(row => row.table_name === tableName);
}



app.get('/api/:tableName', async (req, res) => {
  const client = await pool.connect();
  try {
    const { tableName: table } = req.params;
    tableExists = await getExistance(pool, table);
    if(!tableExists){
      throw new Error('TableNotFound');
    }
    const columns = await getColumns(client, table);
    const keys = Object.keys(req.query);
    if(keys.some(key => columns.every(column => column.name != key))) {
      throw new Error('BadRequest');
    }
    const whereClause = keys
      .map((key, i) => `${key} = $${i + 1}`)
      .join(' AND ');
    const values = keys.map(key => req.query[key]);
    const query = `SELECT * FROM ${table} ${whereClause ? `WHERE ${whereClause}` : ''}`;
    const { rows } = await client.query(query, values);
    res.json(rows);
  } catch(error){
    switch (error.message) {
      case 'TableNotFound':
        res.status(404).send('Table not found');
        break;
      case 'BadRequest':
        res.status(400).send('Bad request');
        break;
      default:
        console.log(error);
        res.status(500).send('Internal server error');
    }
  } finally {
    client.release();
  }
});

app.post('/api/:tableName', async (req, res) => {
  const client = await pool.connect();
  try {
    const { tableName: table } = req.params;
    const tableExists = await getExistance(client, table);
    if (!tableExists) {
      throw new Error('TableNotFound');
    }
    const columns = await getColumns(client, table);
    const keys = Object.keys(req.body);
    if(keys.length === 0 || keys.some(key => columns.every(column => column.name != key)) || columns.some(column => !column.isNullable && !keys.includes(column.name))) {
      throw new Error('BadRequest');
    }
    const values = keys.map(key => req.body[key]);
    const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${keys.map((key, i) => `$${i + 1}`).join(', ')})`;
    console.log(query, values);
    await client.query(query, values);
    res.status(201).send('Created');
  } catch(error){
    switch (error.message) {
      case 'TableNotFound':
        res.status(404).send('Table not found');
        break;
      case 'BadRequest':
        res.status(400).send('Bad request');
        break;
      default:
        console.log(error);
        res.status(500).send('Internal server error');
    }
  } finally {
    client.release();
  }
});

app.patch('/api/:tableName/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    const { tableName: table, id } = req.params;
    const tableExists = await getExistance(client, table);
    if (!tableExists) {
      throw new Error('TableNotFound');
    }
    const columns = await getColumns(client, table);
    const keys = Object.keys(req.body);
    if(keys.length === 0 || keys.some(key => columns.every(column => column.name != key))) {
      throw new Error('BadRequest');
    }
    const values = keys.map(key => req.body[key]);
    const query = `UPDATE ${table} SET ${keys.map((key, i) => `${key} = $${i + 1}`).join(', ')} WHERE id = $${keys.length + 1}`;
    values.push(id);
    await client.query(query, values);
    res.status(200).send('Updated');
  } catch(error){
    switch (error.message) {
      case 'TableNotFound':
        res.status(404).send('Table not found');
        break;
      case 'BadRequest':
        res.status(400).send('Bad request');
        break;
      default:
        console.log(error);
        res.status(500).send('Internal server error');
    }
  } finally {
    client.release();
  }
});

app.delete('/api/:tableName/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    const { tableName: table, id } = req.params;
    const tableExists = await getExistance(client, table);
    if (!tableExists) {
      throw new Error('TableNotFound');
    }
    const query = `DELETE FROM ${table} WHERE id = $1`;
    await client.query(query, [id]);
    res.status(200).send('Deleted');
  } catch(error){
    switch (error.message) {
      case 'TableNotFound':
        res.status(404).send('Table not found');
        break;
      default:
        console.log(error);
        res.status(500).send('Internal server error');
    }
  } finally {
    client.release();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});