var express = require('express');
var path = require('path');

var router = express.Router();
var multer = require('multer');

var multer = require('multer');
// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  // Init Upload
  const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single('img');
  
  // Check File Type
  function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
  }


router.get('/', function (req, res, next) {
    res.send('welcome');
});

router.post('/',  function (req, res, next) {
    upload(req, res, (err) => {
        if(err){
          res.json({
            msg: err
          });
        } else {
          if(req.file == undefined){
            res.json({
              msg: 'Error: No File Selected!'
            });
          } else {
            console.log({
              msg: 'File Uploaded!',
              file: `uploads/${req.file.filename}`
            });

            
                res.status(201).json({
                    message: ' Image Saved',
                   
                });
            

          }
        }
      });
});


module.exports = router;
