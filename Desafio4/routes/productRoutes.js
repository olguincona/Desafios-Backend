const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/', (req, res) => {
  const { limit } = req.query;
  let products = JSON.parse(fs.readFileSync('./productos.json'));
  if (limit) {
    products = products.slice(0, limit);
  }
  res.json(products);
});

router.get('/:pid', (req, res) => {
  const { pid } = req.params;
  const products = JSON.parse(fs.readFileSync('./productos.json'));
  const product = products.find(p => p.id == pid);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
  } else {
    res.json(product);
  }
});

router.post('/', (req, res) => {
  const newProduct = req.body;
  const products = JSON.parse(fs.readFileSync('./productos.json'));
  const lastProduct = products[products.length - 1];
  const newId = lastProduct ? lastProduct.id + 1 : 1;
  const productWithId = { id: newId, ...newProduct };
  products.push(productWithId);
  fs.writeFileSync('./productos.json', JSON.stringify(products, null, 2));
  res.status(201).json(productWithId);
});

router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const updatedProduct = req.body;
    const products = JSON.parse(fs.readFileSync('./productos.json'));
    const index = products.findIndex(p => p.id == pid);
    if (index === -1) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      const productWithId = { id: parseInt(pid), ...updatedProduct };
      products[index] = productWithId;
      fs.writeFileSync('./productos.json', JSON.stringify(products, null, 2));
      res.json(productWithId);
    }
  });
  
  router.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    const products = JSON.parse(fs.readFileSync('./productos.json'));
    const filteredProducts = products.filter(p => p.id != pid);
    if (filteredProducts.length === products.length) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      fs.writeFileSync('./productos.json', JSON.stringify(filteredProducts, null, 2));
      res.json({ message: 'Product deleted successfully' });
    }
  });
  
  module.exports = router;