const Session = require( "../../models/session");
const User = require( "../../models/Usuario");
const jwt = require('jsonwebtoken');
const express = require('express');
const routerAuth = express.Router();

const secretKey = 'seguridadJWT';

const sessionSave = async (ip, userId) => {
    if(userId) {       
        try {
            await Session.create({ 
                userId: userId,
                session_date: Date.now(),
                ip: ip
            })
        } catch (error) {
            console.log(error)
        }  
    }
}
const validateToken = async (req,res, next)=>{
    const {authorization} = req.headers
    if(authorization) {
        try {
            let userId 
            userId = jwt.verify(authorization, secretKey) 
            req.token = userId      
        } catch (error) {
            console.log(error)
            return res.status(401).json({message: "Token invalido"})
        }
        
    }
    else return res.status(401).json({status: false, message: "No hay autorizacion."})  
    next()
}


const login = async (req, res) => {
    const {email, pass} = req.body
    if(!email || !pass){
        res.status(400).json({error:'email y pass requeridos'})
        return;
    }
    console.log(email, pass)
    try {
        const queryFind = {$and: [{"email": email}, {"pass": pass}]}
        const checkUser = await User.findOne(queryFind)
        let token
        console.log(checkUser)
        if(checkUser)  {
            console.log('----',{userId: checkUser.email}, secretKey, {expiresIn: 60 * 60})
            token = jwt.sign({userId: checkUser._id}, secretKey, {expiresIn: 60 * 60})
            const  ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
            sessionSave(ip, checkUser._id)
            res.status(200).json({token})
        }else{
            res.status(401).json({error:'Usuario incorrecto'})
        }
    } catch (error) {
        console.log(error)
        res.status(401).json({error})
    } 
}

routerAuth.post('/',login);

module.exports={routerAuth,validateToken,login}