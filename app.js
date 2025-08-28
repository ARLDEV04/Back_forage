const express = require('express');
const dataRoute = require('./routes/dataRoutes');
const { getIo } = require('./socket');

const app = express();

//Autorisations cors
//midleware general qui s'applique à tou tes les routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  next();
});

app.use(express.json());

//Injecter io dans les dans les requetes 
app.use((req, res, next) => {
  req.io = getIo();
  next();
});

app.use('/api/data', dataRoute);
module.exports = app;
