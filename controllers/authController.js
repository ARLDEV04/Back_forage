const { doHash, doComparation } = require('../utils/ashing');
const jwt = require('jsonwebtoken');


//Import du model
const Users = require('../models/usersModel');

//Implementation des fonctions de controle

//Inscrpiption
exports.signup = async (req, res) =>{
    const {username, password} = req.body;
    try {

        const normalizeUsername = username.toLowerCase();

        const existingUser = await Users.findOne({username: normalizeUsername});

        if(existingUser){
            return res.status(401).json({success:false, message:"Cet utilisateur existe deja!"});
        }
        
        const hashedPassword = await doHash(password, 10);
        const newUser = new Users({
            username: normalizeUsername,
            password: hashedPassword
        });
        
        const result = await newUser.save();
        result.password = undefined;
        res.status(201).json({success:true, message:"Ajout réussi!"});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Une erreur est survenue lors de l'ajout." });
    }
}

//Connexion
exports.login = async (req, res) =>{
    const {username, password} = req.body;

    try {

        const normalizeUsername = username.toLowerCase();

        const existingUser = await Users.findOne({username: normalizeUsername}).select('+password');

        if(!existingUser){
            return res.status(401).json({success:false, message:"Identifiants de connexion incorrects!"});
        }
        
        const verifyHash = await doComparation(password, existingUser.password);

        if(!verifyHash){
            return res.status(401).json({success:false, message:"Identifiants de connexion incorrects!"});
        }

        const token = jwt.sign({
            userId: existingUser._id,
            userName: existingUser.username
        }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            success: true,
            token,
            message: "Connexion réussie"
        });

    }catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Une erreur est survenue lors de la connexion." });
    }
}

//Verification utilisateur connecté
exports.verify = (req, res) => {
    res.status(200).json({
        success: true,
        userId: req.auth.userId,
        userName: req.auth.userName
    });
};

