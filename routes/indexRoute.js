const express = require('express');

const { 
    homepage ,
    studentsignup,
    studentsignin,
    studentsignout,
    currentUser,
    forgotpassword,
    forgotlink,
    resetPassword,
    studentupdate,
    studentavatar,
    alljobs,
    studentresume,
    createcourse,
    courseupdate,
    deletecourse,
    findcourse,
    allcourses,
    enrollcourse,
    createstudentreview
} = require('../controllers/indexController');

const { isAuthenticated } = require('../middlwares/auth');
const router = express.Router();

// get /    
router.get('/',homepage)

// get /loginstudent
router.get('/student',isAuthenticated, currentUser)

// post /student/signup
router.post('/student/signup',studentsignup)

// post /student/signin
router.post('/student/signin',studentsignin)

// Get /student/signout
router.get('/student/signout',isAuthenticated,studentsignout)


// post /student/update
router.post('/student/update',isAuthenticated,studentupdate)

// Post /forgot/password
router.post('/forgot/password',forgotpassword)

// Get /forgot/link
router.post('/forgot/reset_link/:id',forgotlink)

// Post /reset/password
router.post('/reset/password',isAuthenticated,resetPassword)

// post /student/update
router.post('/student/update',isAuthenticated,studentupdate)

// post /student/avatar
router.post('/student/avatar',isAuthenticated,studentavatar)

// post /alljobs
router.get('/alljobs',alljobs)

// post /courses
router.get('/allcourses',allcourses)

router.get('/sresume/:sid',studentresume)


router.post('/create/course',isAuthenticated,createcourse)

router.get('/course/find/:cid',isAuthenticated,findcourse)

router.post('/update/course/:id',isAuthenticated,courseupdate)


router.post('/delete/course/:id',isAuthenticated,deletecourse)

// post /employee/apply
router.get('/enroll/:cid', isAuthenticated, enrollcourse);

// post /student/review
router.post('/review/student', isAuthenticated, createstudentreview);


module.exports = router;