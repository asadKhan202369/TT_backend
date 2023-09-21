const express = require('express')

const { isAuthenticated } = require('../middlwares/auth');
const router = express.Router();

const {
    employeesignup,
    employeesignin,
    currentemployee,
    employeesignout,
    createopportunity,
    confirmemployee,
    editopportunity,
    findopportunity,
    deleteopportunity,
    forgotpassword,
    forgotlink,
    resetPassword,
    employeeupdate,
    applyjob,
    sheduleinterview,
    employeeavatar,
    createemployeereview
} = require('../controllers/employeecontroller')

// get /signupemployee
router.post('/signup', employeesignup)

// get /loginemployee
router.post('/signin', employeesignin)


// post /employee/opportunity
router.post('/confirm/employee',isAuthenticated, confirmemployee)

// Get /student/signout
router.get('/signout',isAuthenticated,employeesignout)


// Post /forgot/password
router.post('/forgot/password',forgotpassword)

// Get /forgot/link
router.post('/forgot/reset_link/:id',forgotlink)

// Post /reset/password
router.post('/reset/password',isAuthenticated,resetPassword)

// post /student/avatar
router.post('/avatar',isAuthenticated,employeeavatar)

// post /student/update
router.post('/update',isAuthenticated,employeeupdate)

// get /employee
router.get('/detail',isAuthenticated, currentemployee)

// post /employee/opportunity
router.post('/create/opp',isAuthenticated, createopportunity)

// get /employee/opportunity/edit
router.get('/find/opp/:oid',isAuthenticated, findopportunity)

// post /employee/opportunity/edit
router.post('/edit/opp/:oid',isAuthenticated, editopportunity)

// post /employee/opportunity/edit
router.get('/delete/opp/:oid',isAuthenticated, deleteopportunity)

// post /employee/apply
router.post('/apply/:aid', isAuthenticated, applyjob);

// post /employee/scheduleinterview
router.post('/schedule/:sid/:jobid', isAuthenticated, sheduleinterview);

// post /student/review
router.post('/review', isAuthenticated, createemployeereview);


module.exports = router;
    