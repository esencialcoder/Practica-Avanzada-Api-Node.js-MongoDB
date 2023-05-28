'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Anuncio = mongoose.model('Anuncio');
const { buildAnuncioFilterFromReq } = require('../../lib/utils');
const cote = require('cote');
const client = new cote.Requester({ name: 'Client' });
// Return the list of anuncio
router.get('/', (req, res, next) => {

  const start = parseInt(req.query.start) || 0;
  const limit = parseInt(req.query.limit) || 1000; // nuestro api devuelve max 1000 registros
  const sort = req.query.sort || '_id';
  const includeTotal = req.query.includeTotal === 'true';

  const filters = buildAnuncioFilterFromReq(req);

  // Ejemplo hecho con callback, aunque puede hacerse mejor con promesa y await
  Anuncio.list(filters, start, limit, sort, includeTotal, function (err, anuncios) {
    if (err) return next(err);
    res.json({ result: anuncios });
  });
});

// Return the list of available tags
router.get('/tags', asyncHandler(async function (req, res) {
  const distinctTags = await Anuncio.distinct('tags');
  res.json({ result: distinctTags });
}));

// Create
router.post('/', [ // validaciones:
  body('nombre' ).isAlphanumeric().withMessage('nombre must be string'),
  body('venta'  ).isBoolean()     .withMessage('must be boolean'),
  body('precio' ).isNumeric()     .withMessage('must be numeric'),
  body('image' ).isAlphanumeric()     .withMessage('must be numeric')
], asyncHandler(async (req, res) => {

  //alidationResult(req).throw();
  const anuncioData = req.body;

  const { image } = req.files;

  // If no image submitted, exit
  //if (!image) return res.sendStatus(400);

  // If does not have image mime type prevent from uploading
  if (!image.mimetype.startsWith("image/")) return res.status(400).send({'error':'Archivo invalido'});

  const newNameImage= String(Date.now())+'.'+image.name.split('.').pop();
  const pathSystem=__dirname+'/../../public/images/anuncios/' + newNameImage;
  // Move the uploaded image to our upload folder
  await image.mv(pathSystem);

  client.send({ type: 'thumbnail', val: pathSystem }, (respuesta) => {
    console.log(respuesta);
  })

  anuncioData.foto=newNameImage;
  const anuncio = new Anuncio(anuncioData);
  const anuncioGuardado = await anuncio.save();

  res.json({ result: anuncioGuardado });

}));

module.exports = router;
