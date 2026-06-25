const mongoose = require('mongoose');

exports.menuSchema = new mongoose.Schema({
    category: {
        type: String,
        required: [true, 'Please enter the menu category'], 
        trim: true,
        maxLength: [100, 'Menu category cannot exceed 100 characters']
    },  
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FoodItem',
        },
    ],
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
},
    
    {
        toJSON: {virtuals: true },
        toObject: {virtuals: true },


    }

    
)

const Menu = mongoose.model('Menu', exports.menuSchema);
module.exports = Menu;