const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const productModel = require('../model/product');
const fs = require('fs'); 

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dqqkk3iy7',
    api_key: '893228789639723',
    api_secret: 'AbfO-WVwWOfIjEdAUyxGwJdyYtY',
});

const addProduct = async (req, res) => {
    try {
        console.log('Connected to addProduct');

        const { productName, price, description, category } = req.body;
        const productImage = req.file;

        const upload1 = await cloudinary.uploader.upload(productImage.path);

        const data = new productModel({
            productName: productName,
            price: price,
            description: description,
            category: category,
            productImage: upload1.secure_url,
        });
        await data.save();

        fs.unlinkSync(productImage.path);

        res.status(200).send({
            message: 'Product is successfully saved',
            data: data,
            message: "sucessfully post the data"
        });
    } catch (error) {
        console.error('Product uploading error:', error);

        res.status(500).send({
            message: 'Product uploading error',
            error: error.message,
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        // const productId = req.params.id; 
        const {productName , description , price , category} = req.body;

        
        const updatedProduct = await productModel.findByIdAndUpdate(
            { _id: req.params.id } , 
            {productName , description , price , category},
            { new: true } 
        );

        if (!updatedProduct) {
            return res.status(404).send({ message: 'Product not found' });
        }

        res.send({
            status: 200,
            message: 'Product updated successfully',
            data: updatedProduct,
        });
    } catch (error) {
        res.status(500).send({
            message: 'Error updating product',
            error: error.message,
        });
    }
};

const getProduct = async (req, res) => {
    try {
        const data = await productModel.find();
        if (!data) return res.send("Invalid product");
        res.send({
            status: 200,
            message: "Products are found",
            data: data
        })
    } catch (error) {
        res.send({
            message: "Error",
            error: error.message
        })

    }

}

const deleteProduct = async (req, res) => {

    try {
        const data = await productModel.findByIdAndDelete({ _id: req.params.id });
        console.log(req.params.id);
        
        if (!data) return res.send("product not found")
        res.send({
            status: 200,
            message: "Successfully product deleted",
        })

    } catch (error) {
        res.send({
            message: "Error",
            error: error.message
        })
    }
}

module.exports = {
    addProduct,
    upload,
    updateProduct,
    deleteProduct,
    getProduct
};
