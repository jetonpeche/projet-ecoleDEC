CREATE DATABASE anguphaser;

CREATE TABLE boutique
(
    idItem int AUTO_INCREMENT,

    nomItem varchar(50),
    iconeItem varchar(50),
    descriptionItem varchar(150),
    prixItem decimal(4, 2),

    primary key (idItem)
);

CREATE TABLE SauvegardePartie
(
    idSauvegarde int AUTO_INCREMENT,

    vieJoueur char(1),
    vieAdvaisaire char(1),

    primary key(idSauvegarde)
);

CREATE TABLE utilisateur
(
    idUtilisateur int AUTO_INCREMENT,

    nomUtilisateur varchar(50),
    prenomUtilisateur varchar(50),
    dateNaissanceUtilisateur date,
    mailUtilisateur varchar(150),
    adresseUtilisateur varchar(100),
    pseudoUtilisateur varchar(30),
    mdpUtilisateur varchar(200),

    idBonusActif int DEFAULT null,
    idSauvegarde int DEFAULT null,

    nbVictoire int DEFAULT 0,
    nbDefaite int DEFAULT 0,

    primary key (idUtilisateur),
    foreign key (idBonusActif) references boutique(idItem),
    foreign key (idSauvegarde) references SauvegardePartie(idSauvegarde)
);

CREATE TABLE inventaire
(
    idItem int,
    idUtilisateur int,

    qte int,

    primary key (idItem, idUtilisateur)
);

CREATE TABLE historique
(
    idHistorique int AUTO_INCREMENT,
    idItem int,
    idUtilisateur int,

    dateAchat date,
    qte int,

    primary key(idHistorique, idItem, idUtilisateur),

    foreign key (idItem) references boutique(idItem),
    foreign key (idUtilisateur) references utilisateur(idUtilisateur)
);

-- mdp: a
INSERT INTO utilisateur VALUES (1, "Peyrachon", "Nicolas", "1996-08-23", "a@a.com", "rue du reve", "jetonPeche", "0cc175b9c0f1b6a831c399e269772661", null, null, 0, 0);

INSERT INTO boutique (idItem, nomItem, iconeItem, descriptionItem, prixItem) VALUES (1, "boost vitesse", "boost.jpg", "Ajoute un bonus de vitesse sur ton paddle pour aller a la vitesse de l'éclair !", 2), 
                                                                                    (2, "ralentir adversaire", "ralentir.png", "Ralenti ton adversaire pour gagner plus facilement la partie", 5), 
                                                                                    (3, "vie bonus", "vie.jpg", "Met toutes les chances de ton coté en ajoutant 2 vies supplementaire lors de la partie", 3);