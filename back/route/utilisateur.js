var express = require('express');
const router = express.Router();

var md5 = require('md5');
var jwt = require('jsonwebtoken');
var mySql = require('mysql');

var con = mySql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'anguphaser'
    }
);

// il faut un send() pour aller dans le subcribe
// try catch est geré coté angular => ne sert a rien ici

router.post('/inscription', async function(req, res)
{
    let { nom, prenom, dateNaissance, mail, adresse, pseudo, mdp } = req.body;

    const MDP_CRYPTE = md5(mdp.toString());
    const SQL_NOMBRE_USER = "SELECT COUNT(*) AS nombre FROM utilisateur WHERE pseudoUtilisateur = ?";

    con.query(SQL_NOMBRE_USER, [nom], (erreur, reponse) =>
    {
        if(reponse[0].nombre == 0)
        {       
            const SQL_AJOUT_UTILISATEUR = 'INSERT INTO utilisateur (nomUtilisateur, prenomUtilisateur, dateNaissanceUtilisateur, mailUtilisateur, adresseUtilisateur, pseudoUtilisateur, mdpUtilisateur) VALUES (?, ?, ?, ?, ?, ?, ?)';
            
            con.query(SQL_AJOUT_UTILISATEUR, [nom, prenom, dateNaissance, mail, adresse, pseudo, MDP_CRYPTE], (err, reponse2, fields) =>
            {
                if(!err)
                {
                    let token = jwt.sign({ data: reponse2 }, 'secret');
                    res.send({ status: 1 });
                }
                else
                {
                    res.send({ status: 0, data: err });
                }
            });
        }
        else
        {
            res.send({ status: 0, data: "le pseudo existe deja !" });
        }
    }); 
});

router.post('/connexion', async function(req, res)
{
    let { adresseMail, mdp } = req.body;
    const MDP_CRYPTE = md5(mdp.toString());

    const SQL = "SELECT pseudoUtilisateur, idUtilisateur, idBonusActif, u.idSauvegarde, p.vieJoueur, p.vieAdvaisaire FROM utilisateur u LEFT JOIN sauvegardePartie p ON u.idSauvegarde = p.idSauvegarde WHERE mailUtilisateur = ? AND mdpUtilisateur = ?";

    con.query(SQL, [adresseMail, MDP_CRYPTE], (err, reponse) =>
    {
        if(reponse.length == 1)
        {
            let token = jwt.sign({ data: reponse }, 'secret');
            res.send({ status: 1, token: token, data: reponse });
        }
        else
        {
            res.send({ status: 0 });
        }
    });
});

module.exports = router;