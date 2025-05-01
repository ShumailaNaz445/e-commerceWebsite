
const cloudinary = require('cloudinary').v2;
const productModel = require('../model/product');
const fs = require('fs'); 
const upload = require('../middleware/multer')


cloudinary.config({
    cloud_name: 'dqqkk3iy7',
    api_key: '893228789639723',
    api_secret: 'AbfO-WVwWOfIjEdAUyxGwJdyYtY'
});
// console.log( process.env.cloud_name , process.env.api_key , process.env.api_secret);

const addProduct = async (req, res) => {
    try {
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
        const {search , category}= req.query;
        const filters = {};
        if(search){
            filters.productName = {$regex:search , $options:"i"}
        }
        if(category){
            filters.category =  { $regex: category, $options: "i" };
        }


        const data = await productModel.find(filters);
        if (!data || !data.length === 0) return res.status(404).send("Invalid product");
        else{
            res.send({
                status: 200,
                message: "Product is found",
                data: data
            })
        }
    } catch (error) {
        res.status(500).send({
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
        res.status(500).send({
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
