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

// il faut un send() pour aller dans le subcribe
// try catch est geré coté angular => ne sert a rien ici

router.post('/reprendrePartie', async function(req, res)
{
    let { idJoueur } = req.body;

    const SQL = "SELECT vieJoueur, vieAdvaisaire FROM utilisateur u JOIN sauvegardePartie s ON u.idSauvegarde = s.idSauvegarde WHERE idUtilisateur = ?";

    con.query(SQL, [idJoueur], (erreur, reponse) =>
    {
        res.send({ data: reponse });
    });
});

router.post('/sauvegarderPartie', async function(req, res)
{
    let { vieJoueur, vieAdvairsaire, idJoueur } = req.body;

    const SQL_NOMBRE_USER = "SELECT idSauvegarde FROM utilisateur WHERE idUtilisateur = ?";

    con.query(SQL_NOMBRE_USER, [idJoueur], (erreur, reponse) =>
    {
        // ajout sauvegarder
        if(reponse[0].idSauvegarde == null)
        {
            const SQL_AJOUT_SAVE = 'INSERT INTO sauvegardepartie (vieAdvaisaire, vieJoueur) VALUES (?, ?)';
            
            con.query(SQL_AJOUT_SAVE, [vieAdvairsaire, vieJoueur], (err, reponse2) =>
            {
                RelierSaveJoueur();         
            });
        }
        // remplacer sauvegade
        else
        {
            EcraserSauvegarde(reponse[0].idSauvegarde);
        }
    }); 

    function RelierSaveJoueur()
    {
        const SQL = "SELECT MAX(idSauvegarde) as id FROM SauvegardePartie";

        con.query(SQL, (err, reponse) =>
            {
                const SQL_RELIER_SAVE = "UPDATE utilisateur SET idSauvegarde = ? WHERE idUtilisateur = ?";

                con.query(SQL_RELIER_SAVE, [reponse[0].id, idJoueur]);

                res.send({ data: { idSave: reponse[0].id, vieJ: vieJoueur, vieA: vieAdvairsaire }});
            });
    }

    function EcraserSauvegarde(_idSave)
    {
        const SQL = "UPDATE SauvegardePartie SET vieAdvaisaire = ?, vieJoueur = ? WHERE idSauvegarde = ?";

        con.query(SQL, [vieAdvairsaire, vieJoueur, _idSave], (err, reponse) => 
        {
            res.send({ data: { idSave: _idSave, vieJ: vieJoueur, vieA: vieAdvairsaire }});
        });
    }
});

router.post('/supprimerSauvegarde', async function(req, res)
{
    let { idJoueur, idSave } = req.body;

    const SQL = "UPDATE utilisateur SET idSauvegarde = NULL WHERE idUtilisateur = ?";

    con.query(SQL, [idJoueur], (erreur, reponse) =>
    {
        if(!erreur)
        {
            SupprimerSauvegarde(idSave);

            res.send({ status: 1 });
        }
    });

    function SupprimerSauvegarde(_id)
    {
        const SQL = "DELETE FROM sauvegardePartie WHERE idSauvegarde = ?";

        con.query(SQL, [_id]);
    }
    
});

module.exports = router;