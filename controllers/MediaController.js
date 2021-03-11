const base64Img = require('base64-img');
const isBase64  = require('is-base64');
const {Media} = require('../models');
const fs    = require('fs');

module.exports = {
    getData: async(req, res)=>{
      try {
        const media = await Media.findAll({
          attributes: ['id', 'image']
        });
        
        const mediaMap = media.map(m=>{
          m.image = `${req.get('host')}/${m.image}`;
          return m;
        })

        return  res.json({
        status: 'success',
        data: mediaMap
      });
      } catch (error) {
        return  res.json(500).json({status: 'error', message: error.message});
      }
    },
    addData: (req, res)=>{
        const {image} = req.body;
        try {
          if(!isBase64(image, {mimeRequired: true})){
            return res.status(400).json({status: 'error', message: 'invalid base64'});
          }
          base64Img.img(image, './public/images', Date.now(), async (err, filePath)=>{
            if(err){
              return res.status(500).json({status: 'error', message: err.message});
            }
            const fileName = filePath.split('/').pop();
            // return  res.json({coba: filePath});
            const media = await Media.create({image: `images/${fileName}`});
            return  res.json({
              status: 'success',
              data: {
                id: media.id,
                image: `${req.get('host')}/images/${fileName}`,
              }
            });
          })
        } catch (error) {
          return  res.json(500).json({status: 'error', message: error.message});
        }
    },
    deleteData: async(req, res)=>{
      const {id} = req.params;
      try {
        const media = await Media.findByPk(id);
        if(!media){
          return res.status(404).json({status: 'error', message: 'Media Not Found'});
        }
        fs.unlink(`./public/${media.image}`, async(error)=>{
          if(error){
            return res.status(400).json({status: 'error', message: error.message});
          }
        })
        await media.destroy();
        return  res.json({status: 'success', message: 'Image Deeted'});
      } catch (error) {
        return  res.status(500).json({status: 'error', message: error.message});
      }
    }
}