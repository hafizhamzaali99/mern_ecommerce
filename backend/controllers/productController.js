const Product = require('../models/productModel')
const ErrorHandler = require('../utils/errorHandler')

// create new product

exports.createProduct = async (req, res,next)=>{
    const product = await Product.create(req.body)
    res.status(200).json({
        success:true,
        product
    })
}

// get all products

exports.getAllproducts = async (req, res) =>{
    const products = await Product.find()
    res.status(200).json({
        success:true,
        products
    })

}

// update product

exports.updateProduct = async (req,res,next) =>{
    let product = await Product.findById(req.params.id)
    if(!product){
        res.status(500).json({
            success:false,
            message:"product not found"
        })
    }
    // next( new ErrorHandler(404, 'Product not found') )
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true,
        product
    })

}

// delete product 

exports.deleteProduct = async (req,res,next)=>{
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
}

// product details

exports.productDetail = async (req,res,next) =>{
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
}