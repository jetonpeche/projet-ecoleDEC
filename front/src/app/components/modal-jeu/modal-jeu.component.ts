import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import Phaser from 'phaser';
import { InventaireService } from 'src/app/services/inventaire.service';
import { JeuService } from 'src/app/services/jeu.service';
import { LogService } from 'src/app/services/log.service';
import { TabScoreService } from 'src/app/services/tab-score.service';

var vieJoueur: number = 0;
var vieAdversaire: number = 0;

@Component({
  selector: 'app-modal-jeu',
  templateUrl: './modal-jeu.component.html',
  styleUrls: ['./modal-jeu.component.css']
})
export class ModalJeuComponent implements OnInit, OnDestroy
{
  estConnecter: boolean;

  private phaserGame: Phaser.Game;
  private config: Phaser.Types.Core.GameConfig;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private inventaireService: InventaireService, 
    private dialogRef: MatDialogRef<ModalJeuComponent>, 
    private toastrServ: ToastrService, 
    private jeuService: JeuService, 
    private logService: LogService,
    private tabScoreServ: TabScoreService
    ) 
  {
    this.config =
    {
      type: Phaser.AUTO,
      height: 600,
      width: 800,
      scene: [Scene],
      parent: 'gameContainer',
      physics:
      {
        default: 'arcade'
      }
    }

    this.config.scene = new Scene(this.RecupereDataPhaser, data.reprendre, this.tabScoreServ, this.jeuService);
  }

  ngOnInit(): void 
  {
    this.estConnecter = this.logService.estConnecte;

    if(this.estConnecter)
    {
      const DATA = { idBonus: sessionStorage.getItem("idBonus"), idUtilisateur: sessionStorage.getItem('idJoueur') };
      this.inventaireService.SupprimerBonusProchainePartie(DATA).subscribe(
        () =>
        {
          this.phaserGame = new Phaser.Game(this.config);
        },
        () =>
        {
          this.toastrServ.error("Vous n'êtes plus connecté(e) à internet", "Erreur");
        });
    }
    else
    {
      this.phaserGame = new Phaser.Game(this.config);
    }
  }

  EstConnecter(): boolean
  {
    return this.logService.estConnecte;
  }

  SauvegarderPartie(): void
  {
    const DATA = { vieJoueur: vieJoueur, vieAdvairsaire: vieAdversaire, idJoueur: sessionStorage.getItem('idJoueur') }; 

    this.jeuService.SauvegarderPartie(DATA).subscribe(
      (dataSave) =>
      {
        this.jeuService.EnregistrerSave(dataSave.data.idSave, dataSave.data.vieA, dataSave.data.vieJ);
        
        this.dialogRef.close();
        this.toastrServ.success("Sauvegarde éffectuée", "Sauvegarde réussi");
      },
      () =>
      {
        this.toastrServ.error("Vous n'êtes plus connecté(e) à internet", "Erreur");
      });
  }

  private RecupereDataPhaser(_vieJoueur: number, _vieAdversaire: number): void
  {
    vieJoueur = _vieJoueur;
    vieAdversaire = _vieAdversaire;
  }

  ngOnDestroy(): void
  {
    this.phaserGame.destroy(true);
  }
}

class Scene extends Phaser.Scene
{
  private joueur;
  private balle;
  private btnRejouer;
  private adversaire;
  private touches;

  private txtTentative;
  private txtVie;
  private txtFin;

  private jeuDebuter: boolean = false;
  private vitessePaddle: number = 350;
  private vitesseAdversaire: number = 220;
  private vieJoueur: number = 3;
  private vieAdversaire: number = 3;
  private tentativeRestante: number;

  private dataEnvoye: boolean = false;
  private reprendrePartie: boolean;

  private RecupereDataPhaser;
  private tabScoreServ: TabScoreService;
  private jeuService: JeuService;

  // velocite initial de la balle
  //Y NE PEUT PAS ETRE PLUS GRAND QUE LA VITESSE JOUEUR
  private readonly INIT_BALLE_VELOCITE_X: number = 150;
  private readonly INIT_BALLE_VELOCITE_Y: number = 150;

  constructor(_RecupereDataPhaser, _reprendrePartie: boolean, private _serv: TabScoreService, private _servJeu: JeuService)
  {
    super({key: 'main'});

    this.RecupereDataPhaser = _RecupereDataPhaser;
    this.reprendrePartie = _reprendrePartie;

    this.tabScoreServ = _serv;
    this.jeuService = _servJeu;

    // reprendre partie
    if(this.reprendrePartie)
    {
      this.ReprendrePartie();
    }

    // bonus
    if(sessionStorage.getItem("idBonus") != null)
    {
      this.AjouterBonus();
    }
  }

  preload(): void
  {
    // bck
    this.load.image('bck', '../../assets/PNG/set1_background.png');
    this.load.image('bck1', '../../assets/PNG/set1_tiles.png');
    this.load.image('bck2', '../../assets/PNG/set1_hills.png');

    // paddle
    this.load.image('joueur', '../../assets/PNG/paddle/joueur.png');
    this.load.image('adversaire', '../../assets/PNG/paddle/adversaire.png');

    // balle
    this.load.image('balle', '../../assets/PNG/balle.png');

    // btn rejouer
    this.load.image('btnRejouer', '../../assets/PNG/rejouer.png');
  }

  create(): void
  {
    this.AjoutBck('bck');
    this.AjoutBck('bck1');
    this.AjoutBck('bck2');

    // met la balle au centre de la scene et son sprite
    this.balle = this.physics.add.sprite(this.physics.world.bounds.width / 2, this.physics.world.bounds.height / 2, 'balle');

    // Place le bouton sur l'écran de la scene et son sprite et le rend cliquable
    this.btnRejouer = this.add.sprite(this.physics.world.bounds.width / 2, (this.physics.world.bounds.height / 2) + 150, 'btnRejouer');
    this.btnRejouer.setInteractive();
    this.btnRejouer.on('pointerdown', () =>
    {
      this.Rejouer();
    });

    this.RecupereDataPhaser(this.vieJoueur, this.vieAdversaire);

    // rebond sur x et y avec la meme velocité
    this.balle.setBounce(1, 1);

    // ajout du joueur et le place a droite centré
    this.joueur = this.physics.add.sprite(this.physics.world.bounds.width - 30, this.physics.world.bounds.height / 2, 'joueur');
      
    // ajout de l'adversaire et le place a gauche centré
    this.adversaire = this.physics.add.sprite(30, this.physics.world.bounds.height / 2, 'adversaire');
     
    // ne peut pas etre poussé par une force
    this.joueur.setImmovable(true);
    this.adversaire.setImmovable(true);

    // ne pas sortir de la scene
    this.balle.setCollideWorldBounds(true);
    this.adversaire.setCollideWorldBounds(true);
    this.joueur.setCollideWorldBounds(true);

    // Utiliser les fleches du clavier
    this.touches = this.input.keyboard.createCursorKeys();

    // ajout de l'interaction avec la balle et les paddles
    this.physics.add.collider(this.balle, this.joueur);
    this.physics.add.collider(this.balle, this.adversaire);

    // ajout txt
    this.txtVie = this.add.text(this.physics.world.bounds.width / 3.5, 20, `vies adversaire: ${this.vieAdversaire} | vies joueur: ${this.vieJoueur}`);
    this.txtFin = this.add.text(this.physics.world.bounds.width / 4, this.physics.world.bounds.height /2, "", { color: 'black', fontSize: '3em' });

    this.txtTentative = this.add.text(this.physics.world.bounds.width / 3, 550, `Tentative restantes: ${this.tentativeRestante}`);

    this.txtFin.setVisible(false);
    this.btnRejouer.setVisible(false);

    // connecté
    if(sessionStorage.getItem("idJoueur") != null)
      this.txtTentative.setVisible(false);
    else
    {
      this.tentativeRestante = +sessionStorage.getItem('nbTentativeRestante');
    }
  }

  update(): void
  {
    if(!this.jeuDebuter)
    {
      this.txtTentative.setText(`Tentative restantes: ${this.tentativeRestante}`);
      this.SetVelociteBalle(this.INIT_BALLE_VELOCITE_X, this.INIT_BALLE_VELOCITE_Y);
      this.jeuDebuter = true;
    }

    if(!this.JeuTerminer())
    {
      this.VerifPointMarquer();
  
      this.DeplacementAdversaire();
  
      // deplacement fleches
      this.Deplacement();
      this.ControleVitesseMaxBalle();
    }
    else
    {
      this.GameOver();
    }
  }

  VerifPointMarquer(): void
  {
    // adversaire marque
    if(this.balle.body.x > this.joueur.body.x + 25)
    {
      this.SetVelociteBalle(0, 0);
      this.RetirerVie(false, true);

      this.ResetPosition(this.joueur);
      this.ResetPosition(this.adversaire);
      this.ResetPosition(this.balle, true);

      this.jeuDebuter = false;
      this.RecupereDataPhaser(this.vieJoueur, this.vieAdversaire);
    }

    // joueur marque
    if(this.balle.body.x < this.adversaire.body.x - 25)
    {
      this.SetVelociteBalle(0, 0);
      this.RetirerVie(true);

      this.ResetPosition(this.joueur);
      this.ResetPosition(this.adversaire);
      this.ResetPosition(this.balle, true);

      this.jeuDebuter = false;
      this.RecupereDataPhaser(this.vieJoueur, this.vieAdversaire);
    }

      this.txtVie.setText(`vies adversaire: ${this.vieAdversaire} | vies joueur: ${this.vieJoueur}`);
  }

  SetVelociteBalle(_velociteX, _velociteY): void
  {
    this.balle.setVelocityX(_velociteX);
    this.balle.setVelocityY(_velociteY);
  }

  DeplacementAdversaire(): void
  {
    // adversaire suit la balle
    this.adversaire.body.velocity.setTo(this.balle.body.velocity.y);
    this.adversaire.body.velocity.x = 0;
    this.adversaire.body.maxVelocity.y = this.vitesseAdversaire;
  }

  Deplacement(): void
  {
    // empeche le paddle de garde sa velocite
    this.joueur.body.setVelocityY(0);

    // deplacement haut
    if(this.touches.up.isDown)
    {
      this.joueur.body.setVelocityY(-this.vitessePaddle);
    }

    // deplacement bas
    if(this.touches.down.isDown)
    {
      this.joueur.body.setVelocityY(this.vitessePaddle);
    }
  }

  ControleVitesseMaxBalle(): void
  {
    // balle ne peut pas aller plus vite que le joueur
    if(this.balle.body.velocity.y > this.vitessePaddle)
    {
      this.balle.body.setVelocityY(this.vitessePaddle);
    }

    if(this.balle.body.velocity.y < -this.vitessePaddle)
    {
      this.balle.body.setVelocityY(-this.vitessePaddle);
    }
  }

  AjoutBck(_nomImg: string): void
  {
    this.physics.add.sprite(this.physics.world.bounds.width / 2, this.physics.world.bounds.height / 2, _nomImg);
  }

  ResetPosition(_obj, _estBalle: boolean = false): void
  {
    if(_estBalle)
    {
      _obj.setX(this.physics.world.bounds.width / 2);
    }
      _obj.setY(this.physics.world.bounds.height / 2);
  }

  JeuTerminer(): boolean
  {
    return this.vieAdversaire < 0 || this.vieJoueur < 0;
  }

  GameOver(): void
  {
    this.SetVelociteBalle(0, 0);
    let _victoire: boolean;

      if(this.vieJoueur < 0)
      {
        this.txtFin.setText("Partie terminer: Défaite");
        _victoire = false;     
      }
      else
      {
        this.txtFin.setText("Partie terminer: Victoire");
        _victoire = true;
      }

      // connecté
      if(!this.dataEnvoye && sessionStorage.getItem("idJoueur") != null)
      {
        this.dataEnvoye = true;
        this.EnregistrerVictoireDefaite(_victoire);
      }

      this.txtFin.setVisible(true);
      this.btnRejouer.setVisible(true);     
  }

  RetirerVie(adversaire: boolean = false, joueur: boolean = false): void
  {
    if(adversaire)
    {
      this.vieAdversaire--;
    }
    else if(joueur)
    {
      this.vieJoueur--;
    }
  }

  Rejouer(): void
  {
    // pas connecté
    if(sessionStorage.getItem("idJoueur") == null)
    {
      if(this.tentativeRestante > 0)
      {
        this.vieAdversaire = 3;
        this.vieJoueur = 3;

        this.ResetPosition(this.joueur);
        this.ResetPosition(this.adversaire);
        this.ResetPosition(this.balle, true);

        this.jeuDebuter = false;
        this.dataEnvoye = false;

        this.txtFin.setVisible(false);
        this.btnRejouer.setVisible(false); 

        this.tentativeRestante--;
        sessionStorage.setItem('nbTentativeRestante', this.tentativeRestante.toString());
      }
    }
    else
    {
      this.vieAdversaire = 3;
      this.vieJoueur = 3;

      this.ResetPosition(this.joueur);
      this.ResetPosition(this.adversaire);
      this.ResetPosition(this.balle, true);

      this.jeuDebuter = false;
      this.dataEnvoye = false;

      this.txtFin.setVisible(false);
      this.btnRejouer.setVisible(false); 
    }
  }

  ReprendrePartie(): void
  {
    let dataSave = JSON.parse(sessionStorage.getItem("dataSave"));;
      
    this.vieJoueur = +dataSave.vieJ;
    this.vieAdversaire = +dataSave.vieA;
  }

  AjouterBonus(): void
  {
    switch (sessionStorage.getItem("idBonus")) 
      {
        // boost vitesse
        case "1":
          this.vitessePaddle += 75;
          console.log(this.vitessePaddle);
        break;

        // adversaire ralenti
        case "2":
          this.vitesseAdversaire = 150;
          console.log(this.vitesseAdversaire);
        break;

        // plus de vie
        case "3":
          this.vieJoueur += 2;
          console.log(this.vieJoueur);
        break;
      }

      sessionStorage.removeItem("idBonus");
  }

  EnregistrerVictoireDefaite(_victoire: boolean): void
  {
    const DATA = { victoire: _victoire, idJoueur: sessionStorage.getItem('idJoueur') };

    this.tabScoreServ.EnregistrerVictoireDefaite(DATA).subscribe(
      () =>
      {
        if(this.reprendrePartie)
          this.SupprimerSauvegarde();
      }
    );
  }

  SupprimerSauvegarde():void
  {
    const DATA = { idJoueur: sessionStorage.getItem('idJoueur'), idSave: sessionStorage.getItem("idSave") };

    this.jeuService.SupprimerSauvegarde(DATA).subscribe(
      () =>
      {
        this.jeuService.SupprimerSessionSave();
      }
    );
  }
}