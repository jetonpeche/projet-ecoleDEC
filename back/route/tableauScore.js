var express = require('express');
const router = express.Router();

var mySql = require('mysql');

var con = mySql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'anguphaser'
    }
);

router.get('/listeScore', async function(req, res)
{
    const SQL_LIST_SCORE = "SELECT pseudoUtilisateur, nbVictoire, nbDefaite, (nbVictoire + nbDefaite) AS totalPartie FROM utilisateur ORDER BY nbVictoire";

    con.query(SQL_LIST_SCORE, (erreur, reponse) =>
    {
        res.send({ data: reponse });
    });
});

router.post('/enregistrerVictoireDefaite', async function(req, res)
{
    let sql;
    let { victoire, idJoueur } = req.body;

    if(victoire == true)
    {
        sql = "UPDATE utilisateur SET nbVictoire = nbVictoire + 1 WHERE idUtilisateur = ?";
    }
    else
    {
        sql = "UPDATE utilisateur SET nbDefaite = nbDefaite + 1 WHERE idUtilisateur = ?";
    }

    con.query(sql, [idJoueur], (erreur, reponse) =>
    {
        res.send({ status: 1 });
    });
});

module.exports = router;