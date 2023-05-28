const cote = require('cote');
const thumbnailService = new cote.Responder({ name: 'Thumbnail Service' });

const jimp = require("jimp");

async function resizeImg(path) {
    try{
        // Read the image.
        const image = await jimp.read(path);

        // Resize the image to width 150 and auto height.
        await image.resize(100, 100);

        // Save and overwrite the image
        await image.writeAsync(path);
    }catch(e){
        console.log('Error! :')
        console.log(e)
    }
}

thumbnailService.on('thumbnail', (req, cb) => {
    resizeImg(req.val)
    cb('Imagen renderizada: '+req.val);
});