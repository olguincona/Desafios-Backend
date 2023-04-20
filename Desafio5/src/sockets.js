const socketio = require('socket.io');

module.exports = function(server) {
  const io = socketio(server);

  io.on('connection', function(socket) {
    console.log('Usuario conectado');

    socket.on('disconnect', function() {
      console.log('Usuario desconectado');
    });

    socket.on('newProduct', function(product) {
      // Agregar el nuevo producto a la base de datos
      io.emit('updateProducts', product);
    });

    socket.on('deleteProduct', function(productId) {
      // Eliminar el producto de la base de datos
      io.emit('updateProducts', productId);
    });
  });
};
