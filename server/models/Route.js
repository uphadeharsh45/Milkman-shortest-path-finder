const mongoose=require('mongoose')

const locationSchema = new mongoose.Schema({
    name:{ 
        type:String,
        required:true
    },
    lat: {
        type:Number,
        required:true
    },
    lng: {
        type:Number,
        required:true
    },
    time: String,
    phoneNumber: String,
});

const routeSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'user' 
        }, // Reference to the User model
    // name: String,
    locations: [locationSchema], // Array of locations with the defined schema
});

const Route = mongoose.model('route', routeSchema);

module.exports = Route;

