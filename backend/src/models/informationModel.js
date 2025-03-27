const mongoose = require('mongoose');
const inforSchema = new mongoose.Schema({
    title:{type: String, required: true},
    hovaten:{type: String, required: true},
    ngaysinh:{type: String, required: true},
    noisinh:{type: String, required: true},
    diachihientai:{type: String, required: true},
    sdt:{type: String, required: true},
    email:{type: String, required: true},
    workplace:{type: String, required: true},
});
module.exports = mongoose.model('information', inforSchema);