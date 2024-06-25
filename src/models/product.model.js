const mongoose = require('mongoose');

const productSchema = {
    _id : mongoose.Schema.Types.ObjectId,
    title: {type: String},
    description: {type: String},
    category: {type: String},
    price: {type: Number},
    discountPercentage: {type: Number},
    rating: {type: Number},
    stock: {type: Number},
    tags: {type: Array},
    brand: {type: String},
    sku: {type: String},
    weight: {type: Number},
    dimensions: {type: Object},
    warrantyInformation: {type: String},
    shippingInformation: {type: String},
    availabilityStatus: {type: String},
    reviews: {type: Array},
    returnPolicy: {type: String},
    minimumOrderQuantity: {type: Number},
    meta: {type: Object},
    images: {type: Array},
    thumbnail: {type: Array}
}

module.exports = mongoose.model('product', productSchema);