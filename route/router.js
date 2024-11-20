const router = require ('express').Router();
const userinfo = require ('../controller/usercontroller');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
// const multer = require ('multer')


router.post("/mydata" , userinfo.mydata);


router.put('/updatedata/:id',userinfo.updatedata);

router.get("/getdata" ,   userinfo.getdata);

router.delete("/deletedata/:id" , userinfo.deletedata );

router.post('/logindata' , userinfo.logindata);

router.post('/forget-password' , userinfo.forgetpassowrd);

router.put('/reset-password' , auth ,  userinfo.resetpassword);

router.get('/admin-panel', admin , userinfo.createAdmin );

router.put('/updateadmin' , userinfo.updateAdmin)

// router.post('/upload' ,  userinfo.upload)




module.exports = router


