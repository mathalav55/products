const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Product = require('../models/product.model')

router.get('/', (req, res, next) => {
    const { page_size, page_no, sort_by, sort } = req.query;
    let skip = 0;
    if (page_no && page_size) {
        skip = page_no * page_size
    } else if (page_no) {
        skip = page_no * 10
    }
    let _sort = sort_by?.toLocaleLowerCase() || 'title';
    let _sort_direction = sort?.toLowerCase() || 'asc'
    console.log({ _sort, _sort_direction })
    Product.find().sort({ [_sort]: _sort_direction }).limit(page_size || 10).skip(skip).exec().then(async (docs) => {
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

router.post('/', (req, res, next) => {
    console.log({ body: req.body })
    const product = Product({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        thumbnail: req.body.thumbnail
    });

    product.save()
        .then((result) => {
            res.status(200).json({
                message: 'Created Successfully',
                result: {
                    title: result.title,
                    description: result.description,
                    price: result.price,
                    id: result._id
                }
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: 'Error while creating products',
                error: err
            })
        });
})

router.put('/:id', (req, res, next) => {
    console.log({ body: req.body })
    const id = req.params.id;
    const updateOps = {};
    const body = req.body;
    Product.findOneAndUpdate({ _id: id }, { $set: body })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: " Product Updated",
                request: result
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: 'Error while updating product',
                error: err
            })
        })
})

router.get('/search', (req, res, next) => {
    const { page_size, page_no, q,sort_by,sort } = req.query;
    console.log({ query: req.query })
    let skip = 0;
    if (page_no && page_size) {
        skip = (page_no - 1) * page_size
    } else if (page_no) {
        skip = (page_no - 1) * 10
    }
    let _sort = sort_by?.toLocaleLowerCase() || 'title';
    let _sort_direction = sort?.toLowerCase() || 'asc'
    Product.find({
        $or: [
            { title: { $regex: new RegExp(q, 'i') } },
            { description: { $regex: new RegExp(q, 'i') } },
            { category: { $regex: new RegExp(q, 'i') } }
        ]
    }).sort({ [_sort]: _sort_direction }).limit(page_size || 10).skip(skip).exec().then(async (docs) => {
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

router.delete('/:id', (req, res, next) => {
    console.log({ body: req.body })
    const id = req.params.id;
    const body = req.body;
    Product.deleteOne({ _id: id }, { $set: body })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: "Product Deleted",
                request: result
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: 'Error while deleting product',
                error: err
            })
        })
})


module.exports = router;