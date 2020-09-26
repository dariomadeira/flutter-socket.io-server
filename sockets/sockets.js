const {io} = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();
console.log("iniciando desde cero");

bands.addBand(new Band("Queen"));
bands.addBand(new Band("Bon Jovi"));
bands.addBand(new Band("Metálica"));
bands.addBand(new Band("Pinpinela"));

console.log(bands);

//Mensajes de Clientes
io.on('connection', client => {
  console.log("Cliente conectado");
  // emitir el primer estado
  client.emit('active-bands', bands.getBands())

  // desconectado
  client.on('disconnect', () => {
    console.log("Cliente desconectado");
  });

  // mensaje normal
  client.on('mensaje', (payload)=> {
    console.log('Mensaje !!!', payload);
    io.emit('mensaje', {admin: 'nuevo mensaje'});
  });

  // mensaje especial
  client.on('emitir-mensaje', (payload) => {
    //console.log(payload);
    //io.emit('nuevo-mensaje', payload ); // emite a todos incluido el que lo envia
    client.broadcast.emit('nuevo-mensaje', payload ); // emite a todos menos el que lo envio
  });

  // votar por una banda
  client.on('vote-band', (payload)=> {
    //console.log(payload);
    bands.voteBand(payload.id);
    io.emit('active-bands', bands.getBands());
  });

  // agregar una banda
  client.on('add-band', (payload)=> {
    console.log(payload);
    const newBand = new Band(payload.name);
    console.log(newBand);
    bands.addBand(newBand);
    io.emit('active-bands', bands.getBands());
  });

  // borrar una banda
  client.on('delete-band', (payload)=> {
    console.log("llegan los datos", payload);
    bands.deleteBand(payload.id);
    io.emit('active-bands', bands.getBands());
  });



});