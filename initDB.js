'use strict';

const { askUser } = require('./lib/utils');
const { mongoose, connectMongoose, Anuncio, Usuarios } = require('./models');

const BASE_JSON = './base.json';

main().catch(err => console.error('Error!', err));

async function main() {
  
  // Si buscáis en la doc de mongoose (https://mongoosejs.com/docs/connections.html),
  // veréis que mongoose.connect devuelve una promesa que podemos exportar en connectMongoose
  // Espero a que se conecte la BD (para que los mensajes salgan en orden)
  await connectMongoose; 

  const answer = await askUser('Are you sure you want to empty DB and load initial data? (no) ');
  if (answer.toLowerCase() !== 'yes') {
    console.log('DB init aborted! nothing has been done');
    return process.exit(0);
  }

  // Inicializar nuestros modelos
  const baseResult = await initBase(BASE_JSON);
  console.log(`\Datos: Deleted ${baseResult.totalDeletedCount}, loaded ${baseResult.totalLoadedCount} from ${BASE_JSON}`);

  // Cuando termino, cierro la conexión a la BD
  await mongoose.connection.close();
  console.log('\nDone.');
}

async function initBase(fichero) {
  let totalDeletedCount=0;
  let totalLoadedCount=0;

  const deletedCountAnuncios  = await Anuncio.deleteMany();
  totalDeletedCount+=deletedCountAnuncios.deletedCount;
  const loadedCountAnuncios = await Anuncio.cargaJson(fichero);
  totalLoadedCount+=loadedCountAnuncios;

  const  deletedCountUsuarios = await Usuarios.deleteMany();
  totalDeletedCount+=deletedCountUsuarios.deletedCount;
  const loadedCountUsuarios = await Usuarios.cargaJson(fichero);
  totalLoadedCount+=loadedCountUsuarios;
  return { totalDeletedCount, totalLoadedCount };
}
