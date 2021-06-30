var express = require('express');
const router = express.Router();

var utilisateur = require('./utilisateur');
var boutique = require('./boutique');
var inventaire = require('./inventaire');
var jeu = require('./jeu');
var historique = require('./historique');
var tabScore = require('./tableauScore');

router.use('/utilisateur', utilisateur);
router.use('/boutique', boutique);
router.use('/inventaire', inventaire);
router.use('/jeu', jeu);
router.use('/historique', historique);
router.use('/tableauScore', tabScore);

module.exports = router;