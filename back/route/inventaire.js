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

// il faut un send pour aller dans le subcribe
// try catch est geré coté angular => ne sert a rien ici

router.post('/listeInventaire', async function(req, res)
{
    let { id } = req.body;

    const SQL_LIST_ITEM = "SELECT i.idItem, nomItem, descriptionItem, iconeItem, qte FROM inventaire i JOIN boutique b ON b.idItem = i.idItem WHERE idUtilisateur = ?";
    
    con.query(SQL_LIST_ITEM, [id], (erreur, reponse) =>
    {
        if(!erreur)
        {
            res.send({ status: 1, data: reponse });
        }
        else
        {
            res.send({ status: 0, data: erreur });
        }
    });
});

router.post('/ajouterInventaire', async function(req, res)
{
    let json = req.body;
    let list = [];

    let dateJour = new Date();

    // parse JSON en tableau de tableau
    for (let i = 0; i < json.length; i++)
    {
        list.push([json[i].idItem, json[i].idUtilisateur, json[i].qte]);
    }

   for (let i = 0; i < list.length; i++) 
    {
        const SQl_ITEM_EXIST = "SELECT COUNT(*) AS nombre FROM inventaire WHERE idItem = ? AND idUtilisateur = ?";

        con.query(SQl_ITEM_EXIST, [list[i][0], list[i][1]], (erreur, reponse) =>
        {
            // item existe
            if(reponse[0].nombre == 1)
            {
                AddictionerItem(list[i]);
            }
            else
            {
                AjouterItem(list[i]);
            }

            AjouterHistorique(list[i], dateJour);
        });
    }

    res.send({status: 1});

    function AddictionerItem(_item)
    {
        const SQL_LIST_ITEM = "UPDATE inventaire SET qte = qte + ? WHERE idItem = ? AND idUtilisateur = ?";
        
        con.query(SQL_LIST_ITEM, [_item[2], _item[0], _item[1]]);
    }

    function AjouterItem(_item)
    {
        const SQL_LIST_ITEM = "INSERT INTO inventaire (idItem, idUtilisateur, qte) VALUES (?, ?, ?)";
        
        con.query(SQL_LIST_ITEM, [_item[0], _item[1], _item[2]]);
    }

    function AjouterHistorique(_item, _date)
    {
        const SQL_LIST_ITEM = "INSERT INTO historique (idItem, idUtilisateur, qte, dateAchat) VALUES (?, ?, ?, ?)";
        
        con.query(SQL_LIST_ITEM, [_item[0], _item[1], _item[2], _date]);
    }
});

router.post('/ajouterBonusProchainePartie', async function(req, res)
{
    let { idBonus, idUtilisateur } = req.body;

    const SQL = "UPDATE utilisateur SET idBonusActif = ? WHERE idUtilisateur = ?";
    
    con.query(SQL, [idBonus, idUtilisateur], (erreur, reponse) =>
    {
        if(!erreur)
        {
            BonusUtiliser(idBonus, idUtilisateur);
            res.send({ status: 1 });
        }
        else
        {
            res.send({ status: 0, data: erreur });
        }
    });

    function BonusUtiliser(_idBonus, _idUtilisateur)
    {
        const SQL = "UPDATE inventaire SET qte = qte - 1 WHERE idItem = ? AND idUtilisateur = ?";
    
        con.query(SQL, [_idBonus, _idUtilisateur]);
    }
});

router.post('/supprimerBonusProchainePartie', async function(req, res)
{
    let { idBonus, idUtilisateur } = req.body;

    const SQL = "UPDATE utilisateur SET idBonusActif = null WHERE idUtilisateur = ?";
    
    con.query(SQL, [idUtilisateur], (erreur, reponse) =>
    {
        if(!erreur)
        {
            SuppBonusUtiliser(idBonus, idUtilisateur);
            res.send({ status: 1 });
        }
        else
        {
            res.send({ status: 0, data: erreur });
        }
    });

    function SuppBonusUtiliser(_idBonus, _idUtilisateur)
    {
        const SQL = "UPDATE inventaire SET qte = qte + 1 WHERE idItem = ? AND idUtilisateur = ?";
    
        con.query(SQL, [_idBonus, _idUtilisateur]);
    }
});

module.exports = router;