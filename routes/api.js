let express = require("express");
let router = express.Router();
let passport = require('passport');
require("../config/db");
require("../config/passport")(passport);
const Users = require("../controllers/users");
const emailCtrl = require("../controllers/emailCtrl");
const bookingCtrl = require("../controllers/bookingCtrl");

const multer = require("multer");

/* *****Defining Admin POST Routes***** */
const uploadImage = multer({
  dest: "../tmp/csv",
});



//get requests
router.get("/", function (req, res) {
  res.json({
    API: "1.0"
  });
});

// post request
router.post('/saveUserData', Users.registerUser)
router.post('/loginUser', Users.loginUser);
router.post('/addStudentsToList/:name', uploadImage.single("file"),passport.authenticate('jwt', { session: false }), emailCtrl.addStudentsToList);
router.post('/sendMailToStudents/:listId',passport.authenticate('jwt', { session: false }),emailCtrl.sendMailToStudents);
router.post('/updateListStudents/:listId',passport.authenticate('jwt', { session: false }),emailCtrl.updateListStudents);
router.post('/addStudentToList/:listId',passport.authenticate('jwt', { session: false }),emailCtrl.addStudentToList);
router.post('/updateStudentData/:stdId',passport.authenticate('jwt', { session: false }),emailCtrl.updateStudentData);



// get request
router.get('/getAllLists',passport.authenticate('jwt', { session: false }), emailCtrl.getAllLists);
router.get("/downloadSampleEmailCSV",passport.authenticate('jwt', { session: false }),emailCtrl.downloadSampleEmailTemplate);
router.get("/getAllStudentsByList/:listId",passport.authenticate('jwt', { session: false }),emailCtrl.getAllStudentsByList);
router.get("/getAllStudentsByUser",passport.authenticate('jwt', { session: false }),emailCtrl.getAllStudentsByUser);
router.get("/getAllEmailRecords",passport.authenticate('jwt', { session: false }),emailCtrl.getAllEmailRecords);
router.get("/getAllStudentsFromRecord/:recordId",passport.authenticate('jwt', { session: false }),emailCtrl.getAllStudentsFromRecord);


//booking Routes
router.post('/registerAdmin', Users.registerAdmin)
router.post('/loginAdmin', Users.loginAdmin);
router.post('/registerDriver', Users.registerDriver)
router.post('/loginDriver', Users.loginDriver);

router.post('/addTruck',passport.authenticate('admin', { session: false }), bookingCtrl.addTruck);
router.post('/addTrailer',passport.authenticate('admin', { session: false }), bookingCtrl.addTrailer);
router.post('/bookTruck/:truckId',passport.authenticate('driver', { session: false }), bookingCtrl.bookTruck);
router.post('/bookTrailer/:trailerId',passport.authenticate('driver', { session: false }), bookingCtrl.bookTrailer);
router.post('/deliverTruck',passport.authenticate('driver', { session: false }), bookingCtrl.deliverTruck);
router.post('/deliverTrailer/:trailerId',passport.authenticate('driver', { session: false }), bookingCtrl.deliverTrailer);

router.post('/bookItem/:truckId/:trailerId',passport.authenticate('driver', { session: false }), bookingCtrl.bookItem);
router.post('/deliverItem/:bookingId',passport.authenticate('driver', { session: false }), bookingCtrl.deliverItem);

router.get("/getAllTrailers",passport.authenticate('driver', { session: false }),bookingCtrl.getAllTrailers);
router.get("/getAllTrucks",passport.authenticate('driver', { session: false }),bookingCtrl.getAllTrucks);
router.get("/getAllDrivers",passport.authenticate('admin', { session: false }),bookingCtrl.getAllDrivers);
router.get("/getDriverDetails",passport.authenticate('admin', { session: false }),bookingCtrl.getDriverDetails);




module.exports = router;
