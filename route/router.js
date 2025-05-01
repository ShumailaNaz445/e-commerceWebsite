const router = require ('express').Router();
const userinfo = require ('../controller/usercontroller');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


router.post("/mydata" , userinfo.mydata);

router.put('/updatedata/:id',userinfo.updatedata);

router.get("/getdata" ,  auth , userinfo.getdata);

router.delete("/deletedata/:id" , userinfo.deletedata );

router.post('/logindata' , userinfo.logindata);

router.post('/forget-password' , userinfo.forgetpassowrd);

router.put('/reset-password' , auth ,  userinfo.resetpassword);

router.get('/admin-panel', admin , userinfo.createAdmin );

router.put('/updateadmin' , userinfo.updateAdmin);




module.exports = router


