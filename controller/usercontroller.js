const bcrypt = require('bcrypt');
const SignupModel = require('../model/usermodel');
const sendResetPassword = require('../middleware/transporter');
const jwt = require('jsonwebtoken');
const saltRounds = 12;
const nodemailer = require("nodemailer");
const randomString = require('randomstring');




// cloudinary.config({ 
//     cloud_name: process.env.CLOUD_NAME, 
//     api_key: process.env.API_KEY, 
//     api_secret: process.env.API_SECRET // Click 'View API Keys' above to copy your API secret
// });

// console.log(process.env.CLOUD_NAME , process.env.API_KEY , process.env.API_SECRET);








const mydata = async (req, res) => {
    try {
        // console.log("connected")
        const { name, email, password } = req.body;
        // const profileImage = req.file;
        // console.log("profileImage" , profileImage);
        if (!email) return res.send("Invalid email");

        // if (password != confirmPassword) return res.send('Chech your password again');
        // console.log(req.body);
        // const rejex = /^(?!^\d)(?=.*[a-z])(?=.*[A-Z]).{6}$/;
        // if (rejex.test(password)) return res.send('invalid password');
        // if (rejex.test(email)) return res.send('invalid email');
        else {
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(password, salt);
            // const upload1 = await cloudinary.uploader.upload(profileImage.path)
            const data = SignupModel({
                name: name,
                email: email,
                password: hash,
                // profileImage: upload1.secure_url
            })
            data.save();
 
            // const upload1 = await cloudinary.uploader.upload(profileImage.path);
            // console.log("cloudinary" , upload1);
            
            // const uploadResult = await cloudinary.uploader
           
            res.send({
                status: 200,
                message: "Data is successfully saved",
                data: data
            })
        }


    } catch (error) {
        res.send({
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
        res.send({
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
        res.send({
            message: "Error",
            error: error
        })

    }

}

const deletedata = async(req,resp) =>{
    try {
        const data = await SignupModel.findByIdAndDelete({_id:req.params.id})
        if(!data) return resp.send({message:"data not found"})
            resp.send({
              status:200,
              message:"data delete!",
              
            })
    } catch (error) {
        resp.send({
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
        res.send({
            message: "Error",
            error: error.message
        })
    }
}

const createAdmin = async (req, res) => {
    try {
        const adminEmail = "shum.naz246003@gmail.com"; // Hardcoded admin email
        const adminPassword = "admin1234567"; // Hardcoded admin password

        // Check if admin already exists
        const existingAdmin = await SignupModel.findOne({ email: adminEmail });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Create admin user
        const admin = new SignupModel({
            name: "Admin",
            email: adminEmail,
            password: hashedPassword,
            isAdmin: true,
        });

        await admin.save();
        res.status(201).json({ message: "Admin created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error creating admin", error: error.message });
    }
};

// Update Admin
const updateAdmin = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Update isAdmin to true for the specified user
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
        res.status(500).json({ message: "Error updating admin", error: error.message });
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
        res.send({
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
            const user = await signupModel.findByIdAndUpdate(
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
        res.send({
            message: "Email is not avalable",
            error: error
        })
    }
}



module.exports = { mydata, updatedata, getdata, deletedata, logindata, forgetpassowrd, resetpassword , createAdmin , updateAdmin}
