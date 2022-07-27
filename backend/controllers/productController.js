const Product = require('../models/productModel')
const ErrorHandler = require('../utils/errorHandler')
const handleAsyncError = require('../middleware/handleAsyncError')


// create new product

exports.createProduct = handleAsyncError(async (req, res,next)=>{ //using Async Error handler instead of crashing app
    const product = await Product.create(req.body)
    res.status(200).json({
        success:true,
        product
    })
})

// get all products

exports.getAllproducts = handleAsyncError(async (req, res) =>{
    const products = await Product.find()
    res.status(200).json({
        success:true,
        products
    })

})

// update product

exports.updateProduct = handleAsyncError(async (req,res,next) =>{
    let product = await Product.findById(req.params.id)
    if(!product){
        res.status(500).json({
            success:false,
            message:"product not found"
        })
    }
    // next( new ErrorHandler(404, 'Product not found') ) //using centralized error handler insead of if condition 
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true,
        product
    })

})

// delete product 

exports.deleteProduct = handleAsyncError(async (req,res,next)=>{
    let product = await Product.findById(req.params.id)
    if(!product){
        res.status(500).json({
            success:false,
            message:"product not found"
        })
    }
    await product.remove()
    res.status(200).json({
        success:true,
        message:"product deleted successfully"
    })
})

// product details

exports.productDetail = handleAsyncError(async (req,res,next) =>{
    let product = await Product.findById(req.params.id)
    if(!product){
        res.status(500).json({
            success:false,
            message:"product not found"
        })
    }
    res.status(200).json({
        success:true,
        product
    })
})

// search product

exports.searchProduct = handleAsyncError(async (req,res,next)=>{
    let product = await Product.find({
        "$or":[
            {name:{$regex:req.params.key}},
            {description:{$regex:req.params.key}},
            {price:{$regex:req.params.key}},
            {category:{$regex:req.params.key}},
        ]
    })
    if(!product){
        res.status(500).json({
            success:false,
            message:"product not found"
        })
    }
    res.status(200).json({
        success:true,
        product
    })
})