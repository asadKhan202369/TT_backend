const express = require('express');

const { 
    resume,
    addeducation,
    findeducation,
    editeducation,
    deleteducation,
    addjob,
    findjob,
    editjob,
    deletjob,
    addintern,
    findintern,
    editinternships,
    deletinternship,
    addtrain,
    findtrain,
    edittrain,
    deletedtrain,
    addskill,
    findskill,
    editskill,
    ylinks,
    findlink,
    editlink,
    deletlink,
    addachive,
    findachive,
    editachive,
    deleteachive,
    addresponsibility,
    findres,
    editresp,
    deleteresp,
    deletskill,
    addproject,
    findproject,
    updateproject,
    deleteproject

    

} = require('../controllers/resumeController');

const { isAuthenticated } = require('../middlwares/auth');
const router = express.Router();

// get / resume   
router.get('/resume',isAuthenticated,resume)


// /----------------------------- Educ  ation ---------------------------------/

// get /resume/education    
router.post('/resume/education',isAuthenticated,addeducation)

// get /find/education    
router.get('/resume/finde/:eduid',isAuthenticated,findeducation)

// get /upadte/education    
router.post('/resume/edit-edu/:eduid',isAuthenticated,editeducation)

// get /resume/education    
router.post('/resume/delete-edu/:eduid',isAuthenticated,deleteducation)

// /----------------------------- Job ---------------------------------/

// get /resume/Job   

router.post('/resume/job',isAuthenticated,addjob)

// get /find/Job    
router.get('/resume/findj/:jobid',isAuthenticated,findjob)

// get /resume/Job    
router.post('/resume/edit-job/:jobid',isAuthenticated,editjob)

// get /resume/Job    
router.post('/resume/delete-job/:jobid',isAuthenticated,deletjob)


// /----------------------------- Intern ---------------------------------/

// get /resume/intern    
router.post('/resume/intern',isAuthenticated,addintern)

// get /resume/intern    
router.get('/resume/findi/:intid',isAuthenticated,findintern)

// get /resume/intern    
router.post('/resume/edit-intern/:intid',isAuthenticated,editinternships)

// get /resume/intern    
router.post('/resume/delete-intern/:intid',isAuthenticated,deletinternship)

// /----------------------------- Responsibility ---------------------------------/

// get /resume/Responsibility    
router.post('/resume/responsibility',isAuthenticated,addresponsibility)

// get /resume/Responsibility    
router.get('/resume/findr/:resid',isAuthenticated,findres)

// get /resume/Responsibility    
router.post('/resume/edit-res/:resid',isAuthenticated,editresp)

// get /resume/Responsibility    
router.post('/resume/delete-resp/:resid',isAuthenticated,deleteresp)


// /----------------------------- Training ---------------------------------/

// get /resume/traininng    
router.post('/resume/train',isAuthenticated,addtrain)

// get /resume/training    
router.get('/resume/findt/:trainid',isAuthenticated,findtrain)

// get /resume/training    
router.post('/resume/edit-train/:trainid',isAuthenticated,edittrain)

// get /resume/training    
router.post('/resume/delete-train/:trainid',isAuthenticated,deletedtrain)


// /----------------------------- Portfolio ---------------------------------/


// get /resume/portfolio    

router.post('/resume/links',isAuthenticated,ylinks)

// findlink.

// get /resume/link    
router.get('/resume/findl/:linkid',isAuthenticated,findlink)

// get /resume/link edit 
router.post('/resume/edit-link/:linkid',isAuthenticated,editlink)

// get /resume/llink    
router.post('/resume/delete-link/:linkid',isAuthenticated,deletlink)


// /----------------------------- Portfolio ---------------------------------/



// /----------------------------- Achive ---------------------------------/

// get /resume/achive    
router.post('/resume/achive',isAuthenticated,addachive)


// get /resume/achive    
router.get('/resume/finda/:aid',isAuthenticated,findachive)

// // get /resume/achive    
router.post('/resume/edit-achive/:aid',isAuthenticated,editachive)

// get /resume/achive    
router.post('/resume/delete-achive/:aid',isAuthenticated,deleteachive)

// /----------------------------- Skills ---------------------------------/

// get /resume/skill    
router.post('/resume/skill',isAuthenticated,addskill)

// get /resume/skill    
router.get('/resume/finds/:sid',isAuthenticated,findskill)

// edi /resume/skill    
router.post('/resume/edit-skill/:sid',isAuthenticated,editskill)

// get /resume/skill    
router.post('/resume/delete-skill/:sid',isAuthenticated,deletskill)





// /----------------------------- Projects ---------------------------------/

// get /resume/ project  
router.post('/resume/project',isAuthenticated,addproject)

// get /resume/   project 
router.get('/resume/findp/:pid',isAuthenticated,findproject)

// edi /resume/    
router.post('/resume/edit-project/:pid',isAuthenticated,updateproject)

// get /resume/    
router.post('/resume/delete-project/:pid',isAuthenticated,deleteproject)




module.exports = router;