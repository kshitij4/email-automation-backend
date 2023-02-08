let express = require("express");
let router = express.Router();
let passport = require('passport');
require("../config/db");
require("../config/passport")(passport);
const Users = require("../controllers/users");
const emailCtrl = require("../controllers/emailCtrl");
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


// get request
router.get('/getAllLists',passport.authenticate('jwt', { session: false }), emailCtrl.getAllLists);
router.get("/downloadSampleEmailCSV",passport.authenticate('jwt', { session: false }),emailCtrl.downloadSampleEmailTemplate);
router.get("/getAllStudentsByList/:listId",passport.authenticate('jwt', { session: false }),emailCtrl.getAllStudentsByList);
router.get("/getAllStudentsByUser",passport.authenticate('jwt', { session: false }),emailCtrl.getAllStudentsByUser);
router.get("/getAllEmailRecords",passport.authenticate('jwt', { session: false }),emailCtrl.getAllEmailRecords);


module.exports = router;
