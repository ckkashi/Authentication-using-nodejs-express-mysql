const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const bcryptjs = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const cors = require('cors');
var bodyParser = require('body-parser');

router.use(express.json());
router.use(cors());
router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());   


router.post('/register',
    [body('email').isEmail(),
    body('username').isLength({min:3}),
    body('password').isLength({min:8})],
    async(req,res)=>{

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({msg:errors.errors[0]['msg']});
        }

        let pass = await bcryptjs.hash(req.body.password,10);

        let query = `INSERT INTO users(uid,username,email,password) VALUES ('${uuidv4()}','${req.body.username}','${req.body.email}','${pass}')`;

        let runSql = db.query(query,(error,result)=>{
            if(error){
                return res.status(400).json({msg:'Email already exist',error});
            }
            return res.status(201).json({msg:'Account created successfully.'});
        });
        

        
})

router.post('/login',
    [body('email').isEmail(),
    body('password').isLength({min:8})],
    async(req,res)=>{

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({msg:errors.errors[0]['msg']});
        }

        let query = `SELECT * FROM users WHERE email = '${req.body.email}'`;
        // res.send(query);
        db.query(query,async(error,result)=>{
            if(error){
                return res.status(400).json({msg:'Something went wrong.',error});
            }
            if(result.length === 0){
                return res.status(400).json({msg:'Invalid credentials.'});
            }else{
                const {username,email,password} = result[0];
                let pass = await bcryptjs.compare(req.body.password,password);
                if(pass){
                    return res.status(201).json({msg:'Login successfully.'});
                }else{
                    return res.status(400).json({msg:'Invalid credentials.'});
                }
            }
        });

        

        
        

        
})


module.exports = router;