var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var User = require('./user');

var schema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    mobile: {type: String, required: true},
    cell: {type: String},
    bio: {type: String},
    img: {type: String}
});

// schema.post('remove', function (message) {
//     User.findById(message.user, function (err, user) {
//         user.messages.pull(message);
//         user.save();
//     });
// });

module.exports = mongoose.model('Contact', schema);