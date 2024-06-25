const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Product = require('../models/product.model')

router.get('/', (req, res, next) => {
    const {page_size,page_no} = req.query;
    let skip = 0;
    if(page_no && page_size){
        skip = page_no * page_size
    } else if(page_no){
        skip = page_no * 10
    }
    Product.find().limit(page_size || 10).skip(skip).exec().then(async (docs) => {
        var response;
        if (docs.length == 0) {
            response = {
                message: "No products available.",    
            }
        } else {
            let count = 0;
            count = await Product.countDocuments().exec()
            response = {
                count: count,
                prodcuts: docs,
                page: page_no || 1 
            };
        }
        res.status(200).json(response);
    })
        .catch((err) => {
            res.status(500).json({
                message: 'Error while fetching products',
                error: err
            })
        })
})

module.exports = router;