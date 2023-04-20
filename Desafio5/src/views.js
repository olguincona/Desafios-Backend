const express = require('express');
const router = express.Router();
const handlebars = require('handlebars');

router.get('/', function(req, res) {
  const products = []; // Obtener la lista de productos desde la base de datos
  res.render('index', { products });
});

router.get('/realtimeproducts', function(req, res) {
  const products = []; // Obtener la lista de productos desde la base de datos
  res.render('realTimeProducts', { products });
});

module.exports = router;
