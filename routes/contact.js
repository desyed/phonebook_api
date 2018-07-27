var express = require('express');
var path = require('path');
var router = express.Router();
var jwt = require('jsonwebtoken');
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

var Contact = require('../models/contacts');
var User = require('../models/user');

router.get('/', function (req, res, next) {
    Contact.find({},(err, contacts)=>{
        res.json(contacts)
    })
        // .populate('user', 'firstName')
        // .exec(function (err, data) {
        //     if (err) {
        //         return res.status(500).json({
        //             title: 'An error occurred',
        //             error: err
        //         });
        //     }
        //     res.status(200).json({
        //         message: 'Success',
        //         obj: data
        //     });
        // });
});

// router.use('/', function (req, res, next) {
//     jwt.verify(req.query.token, 'secret', function (err, decoded) {
//         if (err) {
//             return res.status(401).json({
//                 title: 'Not Authenticated',
//                 error: err
//             });
//         }
//         next();
//     })
// });

router.post('/',  function (req, res, next) {
    // var decoded = jwt.decode(req.query.token);
    // User.findById(decoded.user._id, function (err, user) {
    //     if (err) {
    //         return res.status(500).json({
    //             title: 'An error occurred',
    //             error: err
    //         });
    //     }


    const contact = new Contact({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        bio: req.body.bio,
        cell: req.body.cell,
        
    });
   

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

            contact.img = req.file.path;

            console.log({msg: 'File Uploaded! : '+ req.file.path, file: `uploads/${req.file.filename}`});

          }
        }
      });



      contact.save(function (err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(201).json({
            message: 'Saved message',
            obj: result
        });
    });




 
});

router.get('/:id', function (req, res, next) {
    Contact.findById(req.params.id, function (err, data) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });    
        }
        if (!data) {
            return res.status(500).json({
                title: 'No data Found!',
                error: {message: 'data not found'}
            });
        }
        if (data) {
            return res.status(200).json(data);
        }
        
    });
});

router.patch('/:id', function (req, res, next) {
    // var decoded = jwt.decode(req.query.token);
    Contact.findById(req.params.id, function (err, data) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!data) {
            return res.status(500).json({
                title: 'No data Found!',
                error: {message: 'data not found'}
            });
        }
        // if (data.user != decoded.user._id) {
        //     return res.status(401).json({
        //         title: 'Not Authenticated',
        //         error: {message: 'Users do not match'}
        //     });
        // }
        data.name= req.body.name;
        data.email= req.body.email;
        data.mobile= req.body.mobile;
        data.bio= req.body.bio;
        data.img= req.body.img;

        data.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Updated message',
                obj: result
            });
        });
    });
});

router.delete('/:id', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Contact.findById(req.params.id, function (err, message) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!message) {
            return res.status(500).json({
                title: 'No Message Found!',
                error: {message: 'Message not found'}
            });
        }
        if (message.user != decoded.user._id) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: {message: 'Users do not match'}
            });
        }
        message.remove(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Deleted message',
                obj: result
            });
        });
    });
});

module.exports = router;