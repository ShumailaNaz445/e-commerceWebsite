const bcrypt = require('bcrypt');
const SignupModel = require('../model/usermodel');
const sendResetPassword = require('../middleware/transporter');
const jwt = require('jsonwebtoken');
const saltRounds = 12;
const nodemailer = require("nodemailer");
const randomString = require('randomstring');



const mydata = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email) return res.send("Invalid email");

        else {
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(password, salt);
            const data = SignupModel({
                name: name,
                email: email,
                password: hash,
            })
            data.save();
           
            res.send({
                status: 200,
                message: "Data is successfully saved",
                data: data
            })
        }


    } catch (error) {
        res.status(500).send({
            message: "error",
            error: error.message
        })
    }
}


const updatedata = async (req, res) => {
    try {
        const { name, email } = req.body;
        const data = await SignupModel.findByIdAndUpdate({ _id: req.params.id }, { name, email })

        if (!data) return res.send('Invalid user...')
        res.send({
            status: 200,
            message: "Data Updated",
            data: data
        })
    } catch (error) {
        res.status(500).send({
            message: "Invalid User id",
            error: error
        })

    }

}

const getdata = async (req, res) => {
    try {
        const data = await SignupModel.find();
        if (!data) return res.send("Invalid User");
        res.send({
            status: 200,
            message: "Data is found",
            data: data
        })
    } catch (error) {
        res.status(500).send({
            message: "Error",
            error: error
        })

    }

}

const deletedata = async(req,res) =>{
    try {
        const data = await SignupModel.findByIdAndDelete({_id:req.params.id})
        if(!data) return res.send({message:"data not found"})
            res.send({
              status:200,
              message:"data delete!",
              
            })
    } catch (error) {
        res.status(500).send({
            message:"error",
            err:error
        })
    }
}


const logindata = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await SignupModel.findOne({ email: email });
        if (!userData) return res.send("Invalid User");

        const match = bcrypt.compareSync(password, userData.password);
        if (!match) return res.send("Invalid User");
        if (match) {
            jwt.sign(
                { name: userData.name , isAdmin: userData.isAdmin},
                process.env.JWT_SECRET_KEY ,
                { expiresIn: '1d' }, 
                (error, token) => {
                if (error) return res.send({ error: error })
                res.send({
                    status: 200,
                    message: "login Successfully",
                    data: userData,
                    token: token,
                    isAdmin: userData.isAdmin

                })
            })
        }
    } catch (error) {
        res.status(500).send({
            message: "Error",
            error: error.message
        })
    }
}

const createAdmin = async (req, res) => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL; 
        const adminPassword = process.env.ADMIN_PASSWORD; 
        
        const existingAdmin = await SignupModel.findOne({ email: adminEmail });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        const admin = new SignupModel({
            name: "Admin",
            email: adminEmail,
            password: hashedPassword,
            isAdmin: true,
        });

        await admin.save();
        res.status(201).json({ message: "Admin created successfully" });
    } catch (error) {
        res.status(500).send({
            message: "Error",
            error: error.message
        })
    }
};


const updateAdmin = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const updatedUser = await SignupModel.findOneAndUpdate(
            { email },
            { isAdmin: true },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User promoted to admin successfully", data: updatedUser });
    } catch (error) {
        res.status(500).send({
            message: "Error",
            error: error.message
        })
    }
};


const forgetpassowrd = async (req, res) => {
    try {
        const checkUser = await SignupModel.findOne({ email: req.body.email });
        if (checkUser) {
            const randomString1 = randomString.generate();
            console.log(randomString1);

            const data = await SignupModel.updateOne(
                { email: req.body.email },
                { $set: { randomToken: randomString1 } }
            );
            
            sendResetPassword(checkUser.name, checkUser.email, randomString);
            console.log(checkUser.name);
        }

        res.send({
            status: 200,
            message: "Please check your email"
        })

    } catch (error) {
        res.status(500).send({
            message: "Error",
            error: error.message
        })
    }

}

const resetpassword = async (req, res) => {
    try {
        const token = req.params

        const tokenData = await SignupModel.findOne({ randomToken: token })
        if (tokenData) {
            const password = req.body.password;
            const salt = bcrypt.genSaltSync(saltRounds)
            const hashPassword = bcrypt.hashSync(password, salt);
            const user = await SignupModel.findByIdAndUpdate(
                { _id: token._id },
                { $set: { password: hashPassword, randomToken: "" } },
                { new: true }
            );
        }


        res.send({
            status: 200,
            message: "Password Update Successfully",
            success: true
        })

    } catch (error) {
        res.status(500).send({
            message: "Email is not avalable",
            error: error
        })
    }
}



module.exports = { 
    mydata , 
    updatedata , 
    getdata , 
    deletedata , 
    logindata , 
    forgetpassowrd , 
    resetpassword , 
    createAdmin , 
    updateAdmin
}
