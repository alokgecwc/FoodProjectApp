const mongoodb = require('mongoose');

const restaurantSchema = new mongoodb.Schema({
    name: {
        type: String,
        required: [true, 'Please enter the restaurant name'],
        trim: true,
        maxlength: [100, 'Restaurant name cannot exceed 100 characters'],
    },
    isVeg: {
        type: Boolean,
       default: false,  
    },      
    address: {
        type: String,   
        required: [true, 'Please enter the restaurant address'],
        trim: true,
        maxlength: [200, 'Restaurant address cannot exceed 200 characters'],
    },  
    rating: {
        type: Number,
        default: 0,

    },
    numOfReviews: {
        type: Number,
        default: 0, 
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },

        },
      reviews: [
        {    
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
      },
      ],
    image: {
        public_id: {
            type: String,   
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

restaurantSchema.index({ location: '2dsphere' });
restaurantSchema.index({ name: 'text', address: 'text' });

module.exports = mongoodb.model('Restaurant', restaurantSchema);