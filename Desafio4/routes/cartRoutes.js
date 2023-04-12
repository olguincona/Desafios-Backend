const express = require('express');
const router = express.Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

router.post('/', (req, res) => {
  const newCart = {
    id: uuidv4(),
    products: []
  };
  fs.readFile('carrito.json', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error de servidor');
    }
    let carts = [];
    if (data) {
      carts = JSON.parse(data);
    }
    carts.push(newCart);
    fs.writeFile('carrito.json', JSON.stringify(carts), (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Error de servidor');
      }
      res.status(201).json(newCart);
    });
  });
});

router.get('/:cid', (req, res) => {
  const cid = req.params.cid;
  fs.readFile('carrito.json', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error de servidor');
    }
    let carts = [];
    if (data) {
      carts = JSON.parse(data);
    }
    const cart = carts.find(c => c.id === cid);
    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }
    res.json(cart.products);
  });
});

router.post('/:cid/product/:pid', (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = req.body.quantity;
  if (!quantity) {
    return res.status(400).send('La cantidad es obligatoria');
  }
  fs.readFile('productos.json', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error de servidor');
    }
    let products = [];
    if (data) {
      products = JSON.parse(data);
    }
    const product = products.find(p => p.id === pid);
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }
    fs.readFile('carrito.json', 'utf-8', (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Error de servidor');
      }
      let carts = [];
      if (data) {
        carts = JSON.parse(data);
      }
      const cart = carts.find(c => c.id === cid);
      if (!cart) {
        return res.status(404).send('Carrito no encontrado');
      }
      const existingProduct = cart.products.find(p => p.id === pid);
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ id: pid, quantity: quantity });
      }
      fs.writeFile('carrito.json', JSON.stringify(carts), (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send('Error de servidor');
        }
        res.status(201).json(cart);
      });
    });
  });
});

module.exports = router;