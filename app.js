const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const { Client } = require('pg');


app.use(cors())
app.use(express.static('client/www'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// const config = {
//   host: 'localhost',
//   port: 5432,
//   database: 'moviesdb',
//   user: 'Norman',
//   password: 'saber24teeth',
// }

  const config = {
    host: 'ec2-50-17-178-87.compute-1.amazonaws.com',
    port: 5432,
    database: 'd2lbkjieefmepa',
    user: 'uccawmukpoexhw',
    password: 'f2125ca1f2d8bd2876e129edf0e480cad0d252c54dabaf782a790c7167c16d08',
  };



app.get('/api/movies', (req, res, next) => {
  const response = res;
  const client = new Client(config);
  client.connect()
  .then(() => {
    const sql = 'SELECT * FROM movies';
    return client.query(sql);
  }).then(res => {
    response.status(200).json(res.rows);
  }).catch(err => {
    response.status(500).json({error: 'Error Getting Movies List'});
  }).then(() => {
    client.end();
  })
})

app.get('/api/movies/:movieId', (req, res, next) => {
  const response = res;
  const client = new Client(config);
  client.connect()
  .then(() => {
    const sql = `SELECT * FROM movies WHERE id = ${req.params.movieId}`;
    return client.query(sql);
  }).then(res => {
    response.status(200).json(res.rows[0]);
  }).catch(err => {
    response.status(500).json({error: 'Error Getting Movie'});
  }).then(() => {
    client.end();
  })
})

app.post('/api/movies', (req, res, next) => {
  const response = res;
  const client = new Client(config);
  client.connect()
  .then(res => {
    const sql = 'INSERT INTO movies (title, plot, genre) VALUES ($1, $2, $3)';
    const params = [req.body.title, req.body.plot, req.body.genre];
    return client.query(sql, params);
  }).then(res => {
    response.status(200).json({message: 'Successfully Added Movie'})
  }).catch(err => {
    response.status(500).json({error: 'Error Adding Movie'});
  }).then(() => {
    client.end();
  })
})

app.put('/api/movies/:movieId', (req, res, next) => {
  const response = res;
  const client = new Client(config);
  client.connect()
  .then(() => {
    const sql = `UPDATE movies SET title = $1, plot = $2, genre = $3 WHERE id = $4`;
    const params = [req.body.title, req.body.plot, req.body.genre, req.params.movieId];
    return client.query(sql, params);
  }).then(res => {
    response.status(200).json({message: 'Successfully Deleted Movie'});
  }).catch(err => {
    response.status(500).json({error: 'Error Deleting Movie'});
  }).then(() => {
    client.end();
  })
})

app.delete('/api/movies/:movieId', (req, res, next) => {
  const response = res;
  const client = new Client(config);
  client.connect()
  .then(() => {
    const sql = `DELETE FROM movies WHERE id = ${req.params.movieId}`;
    return client.query(sql);
  }).then(res => {
    response.status(200).json({message: 'Successfully Deleted Movie'});
  }).catch(err => {
    response.status(500).json({error: 'Error Deleting Movie'});
  }).then(() => {
    client.end();
  })
})

app.listen(port, () => {
    console.log('Listening on port ' + port);
})