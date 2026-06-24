const Restaurant = require("../models/restaurantModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");

// Get All Restaurants
exports.getAllRestaurants = catchAsyncErrors(async (req, res, next) => {
    const resPerPage = 10;

    const apiFeatures = new APIFeatures(
        Restaurant.find(),
        req.query
    )
        .search()
        .filter()
        .sort()
        .pagination(resPerPage);

    const restaurants = await apiFeatures.query;

    res.status(200).json({
        success: true,
        count: restaurants.length,
        restaurants,
    });
});

// Get Single Restaurant
exports.getRestaurant = catchAsyncErrors(async (req, res, next) => {
    const restaurant = await Restaurant.findById(req.params.storeId);

    if (!restaurant) {
        return next(
            new ErrorHandler("Restaurant not found", 404)
        );
    }

    res.status(200).json({
        success: true,
        restaurant,
    });
});
// get restaurant by id
