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


router.post('/listeHistorique', async function(req, res)
{
    let { idUtilisateur } = req.body;

    const SQL_DATE_ACHAT = "SELECT dateAchat, nomItem, prixItem, SUM(qte) AS qte FROM historique h JOIN utilisateur i ON h.idUtilisateur = i.idUtilisateur JOIN boutique b ON h.idItem = b.idItem WHERE h.idUtilisateur = ? GROUP BY dateAchat, nomItem, prixItem ORDER BY dateAchat DESC, nomItem";

    con.query(SQL_DATE_ACHAT, [idUtilisateur], (erreur, reponse) =>
    {
        res.send({ data: reponse });
    });
});
module.exports = router;