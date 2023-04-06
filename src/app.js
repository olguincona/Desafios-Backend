const express = require('express');
const ProductManager = require('./ProductManager');

const PORT = 8080;
const app = express();
const productManager = new ProductManager('./productos.txt');

app.get('/products', (req, res) => {
  const limit = req.query.limit;
  const products = productManager.getProducts();
  const response = limit ? products.slice(0, limit) : products;
  res.json(response);
});

app.get('/products/:pid', (req, res) => {
  const productId = req.params.pid;
  const product = productManager.getProductById(productId);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
  } else {
    res.json(product);
  }
});

app.listen(PORT, () => {
  console.log('Servidor funcionando en puerto:'+ PORT);
});