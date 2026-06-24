const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { getAllRestaurants, getRestaurant } = restaurantController;

router.route('/').get(getAllRestaurants);
router.route('/:storeId').get(getRestaurant);

module.exports = router;