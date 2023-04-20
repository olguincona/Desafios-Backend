const express = require('express');
const exphbs = require("express-handlebars");
const http = require("http");
const socketIO = require("socket.io");
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

const server = http.createServer(app);
const io = socketIO(server);

const app = express();
app.use(express.json());
app.engine(
    "handlebars",
    exphbs({
      defaultLayout: "main",
      layoutsDir: path.join(__dirname, "views/layouts"),
      partialsDir: path.join(__dirname, "views/partials"),
    })
  );
  app.set("view engine", "handlebars");
  app.set("views", path.join(__dirname, "views"));


io.on("connection", (socket) => {
console.log("Usuario conectado");

// Manejo de evento para la creación de un nuevo producto
socket.on("newProduct", (product) => {
    // Agregar lógica para agregar el producto en la lista
    io.emit("productAdded", product);
});

// Manejo de evento para la eliminación de un producto
socket.on("deleteProduct", (productId) => {
    // Agregar lógica para eliminar el producto de la lista
    io.emit("productDeleted", productId);
});

socket.on("disconnect", () => {
    console.log("Usuario desconectado");
});
});
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

const PORT = 8080;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));