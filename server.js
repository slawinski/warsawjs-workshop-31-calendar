const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const fs2 = require('mz/fs');
const uuid = require('uuid');

const app = express();

const port = process.env.PORT || 3333;

console.log('port:', port);

function getData(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data[id]);
    }, 0);
  });
};

app.listen(port, () => {
  console.log('listening');
});

app.use(bodyParser.json());

const data = {};


app.get('/data', (req, res) => {
  setTimeout(() => {
    res.json(data);
  }, 0);
});

app.get('/data/:id', (req, res) => {
  if (!data.hasOwnProperty(req.params.id)) {
    return res.status(404).json({ error: 'Not found' });
  }
  const promise = getData(req.params.id);
  promise.then((value) =>{
    res.json(value);
  });
});

app.put('/data/:id', (req, res) => {
  data[req.params.id] = req.body;
  res.status(201).json();
});

app.patch('/data/:id', (req, res) => {
  const old = data[req.params.id];
  const change = req.body;
  data[req.params.id] = { ...old, ...change };
  res.status(200).json({ patched: 'ok' });
});

app.delete('/data/:id', (req, res) => {
  if (!data.hasOwnProperty(req.params.id)) {
    return res.status(404).json({ error: 'Not found' });
  }
  delete data[req.params.id];
  res.status(200).json();
});

app.post('/data', (req, res) => {
  const id = uuid.v4();
  data[id] = req.body;
  res.status(201).json({ id });
});

app.get('/file', (req, res) => {
  fs.readFile('file.txt', 'utf-8', (err, data) => {
    if (err) {
      return res.status(404).json({ error: 'not found' });
    }
    res.json({ data });
  });
});

app.get('/file2', (req, res) => {
  fs2.readFile('file.txt', 'utf-8')
    .then((data) => {
      res.json({ data });
    })
    .catch((err) => {
      res.status(404).json({ error: 'not found' });
    });
});

