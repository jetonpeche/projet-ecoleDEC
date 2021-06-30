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

router.get('/listeItemBoutique', async function(req, res)
{
    const SQL_LIST_ITEM = "SELECT * FROM boutique ORDER BY nomItem";
    
    con.query(SQL_LIST_ITEM, (erreur, reponse, field) =>
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

module.exports = router;