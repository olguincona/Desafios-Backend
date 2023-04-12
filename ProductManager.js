const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.products = []
    this.nextId = 1;
    this.path = path;
  }

  addProduct(product) {
    return new Promise((resolve, reject) => {
      const products = this.readProductsFromFile();

      if (!product.title ||
          !product.description || 
          !product.price || 
          !product.thumbnail || 
          !product.code || 
          !product.stock) {
        reject(new Error("Debe ingresar todos los campos"));
        return;
      }

      if (products.some(p => p.code === product.code)) {
        reject(new Error("Este codigo ya esta registrado"));
        return;
      }

      const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
      product.id = nextId;

      products.push(product);

      this.writeProductsToFile(products)
        .then(() => resolve(product))
        .catch(error => reject(error));
    });
  }

  getProducts() {
    return new Promise((resolve, reject) => {
      const products = this.readProductsFromFile();
      resolve(products);
    });
  }

  getProductById(id) {
    return new Promise((resolve, reject) => {
      const products = this.readProductsFromFile();
      const product = products.find(p => p.id === id);

      if (!product) {
        reject(new Error("Not found"));
        return;
      }

      resolve(product);
    });
  }

  updateProduct(id, fieldsToUpdate) {
    return new Promise((resolve, reject) => {
      const products = this.readProductsFromFile();
      const index = products.findIndex(p => p.id === id);

      if (index === -1) {
        reject(new Error("Not found"));
        return;
      }

      const product = { ...products[index], ...fieldsToUpdate };
      products[index] = product;

      this.writeProductsToFile(products)
        .then(() => resolve(product))
        .catch(error => reject(error));
    });
  }

  deleteProduct(id) {
    return new Promise((resolve, reject) => {
      const products = this.readProductsFromFile();
      const index = products.findIndex(p => p.id === id);

      if (index === -1) {
        reject(new Error("Not found"));
        return;
      }

      products.splice(index, 1);

      this.writeProductsToFile(products)
        .then(() => resolve())
        .catch(error => reject(error));
    });
  }

  readProductsFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error no se pudo leer el archivo: ${this.path}`);
      return [];
    }
  }

  writeProductsToFile(products) {
    return new Promise((resolve, reject) => {
      try {
        const data = JSON.stringify(products, null, 2);
        fs.writeFileSync(this.path, data);
        resolve();
      } catch (error) {
        console.error(`Error no se pudo escribir en el archivo: ${this.path}`);
        reject(error);
      }
    });
  }
}
