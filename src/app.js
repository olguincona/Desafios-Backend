/* const express = require('express');
const ProductManager = require('./ProductManager'); */
import express from 'express';
import ProductManager from '../ProductManager.js';

const PORT = 8080;
const app = express();
const productManager = new ProductManager('./productos.txt');

app.get('/products', (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const products = productManager.getProducts();
    const response = limit ? products.slice(0, limit) : products;
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/products/:pid', (req, res) => {
  try {
    const productId = req.params.pid;
    const product = productManager.getProductById(productId);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log('Servidor funcionando en puerto:'+ PORT);
});