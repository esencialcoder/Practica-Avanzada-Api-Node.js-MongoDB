const {Schema, model} = require("mongoose");
const fsPromises = require('fs').promises;

const userSchema = new Schema({
    email: String,
    pass: String
});

/**
 * carga un json de anuncios
 */
userSchema.statics.cargaJson = async function (fichero) {

  const data = await fsPromises.readFile(fichero, { encoding: 'utf8' });

  // Ejemplo de usar una función que necesita callback con async/await
  // const data = await new Promise((resolve, reject) => {
  //   // Encodings: https://nodejs.org/api/buffer.html
  //   fs.readFile(fichero, { encoding: 'utf8' }, (err, data) => {
  //     return err ? reject(err) : resolve(data);
  //   });
  // });

  if (!data) {
    throw new Error(fichero + ' está vacio!');
  }

  const usuarios = JSON.parse(data).users;
  const numUsuarios = usuarios.length;

  for (let i = 0; i < usuarios.length; i++) {
    await (new Usuario(usuarios[i])).save();
  }

  return numUsuarios;

};

userSchema.statics.list = async function(filters, startRow, numRows, sortField, includeTotal, cb) {

  const query = Usuario.find(filters);
  query.sort(sortField);
  query.skip(startRow);
  query.limit(numRows);
  //query.select('nombre venta');

  const result = {};

  if (includeTotal) {
    result.total = await Usuario.countDocuments();
  }
  result.rows = await query.exec();

  if (cb) return cb(null, result); // si me dan callback devuelvo los resultados por ahí
  return result; // si no, los devuelvo por la promesa del async (async está en la primera linea de esta función)
};

const Usuario = model('Users',userSchema);
module.exports = Usuario