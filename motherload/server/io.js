var io = require('socket.io');

module.exports.listen = function(app) {

  io = io.listen(app);

  io.on('connection', (client, next) => {
    console.log("socket on!");
    // console.log(next);
    
    // client.emit('news', { hello: 'world' });
    // client.on('my other event', (data) => {
    // });

  });

  return io;
}