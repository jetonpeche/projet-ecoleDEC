import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InventaireService } from 'src/app/services/inventaire.service';
import { Inventaire } from 'src/app/Type/Inventaire';

@Component({
  selector: 'app-inventaire',
  templateUrl: './inventaire.component.html',
  styleUrls: ['./inventaire.component.css']
})
export class InventaireComponent implements OnInit 
{
  inventaire: Inventaire[] = [];

  idBonusActif: string; 

  private bonusActuelle: Inventaire;

  constructor(private inventaireService: InventaireService, private toastrServ: ToastrService) { }

  ngOnInit(): void
  {
    const DATA = { id: sessionStorage.getItem('idJoueur') };
    
    this.inventaireService.ListeInventaire(DATA).subscribe(
      (liste: Inventaire[]) =>
      {
        this.inventaire = liste["data"];
        
        if(sessionStorage.getItem('idBonus') != null)
        {
          this.idBonusActif = sessionStorage.getItem('idBonus');
          this.bonusActuelle = this.inventaire.find(inventaire => inventaire.idItem == this.idBonusActif);
        } 
      },
      () =>
      {
        this.toastrServ.error("Vous n'êtes plus connecté(e) à internet", "Erreur");
      });
  }

  UiliserProchainePartie(_Idbonus: string, _bonus: Inventaire): void
  {
    // bloque le bouton
    if(_Idbonus == this.idBonusActif || this.bonusActuelle == null)
    {
      if(this.bonusActuelle != null && this.bonusActuelle.idItem != _Idbonus)
      {
        this.bonusActuelle.qte = this.bonusActuelle.qte + 1;
      }

      if(sessionStorage.getItem('idBonus') != null)
      {
        sessionStorage.setItem('idBonus', _Idbonus);
      }
      else
      {
        sessionStorage.removeItem('idBonus');
        sessionStorage.setItem('idBonus', _Idbonus);
      }

      const DATA = { idBonus: _Idbonus, idUtilisateur: sessionStorage.getItem('idJoueur') };

      this.inventaireService.AjouterBonusProchainePartie(DATA).subscribe(
        () =>
        {
          this.bonusActuelle = _bonus;
  
          this.idBonusActif = _Idbonus;
          this.bonusActuelle.qte = this.bonusActuelle.qte - 1;

          this.toastrServ.success("Le bonus: " + this.bonusActuelle.nomItem + " est activé", "Bonus activé");
        },
        () =>
        {
          this.toastrServ.error("Vous n'êtes plus connecté(e) à internet", "Erreur");
        });
    }
    else
    {
      this.toastrServ.warning("Vous devez d'abord déselectionner le bonus actif (" + this.bonusActuelle.nomItem + ") avant de le changer", "Attention");
    }
  }

  SuppBonusProchainePartie(_Idbonus: string, _bonus: Inventaire): void
  {
    const DATA = { idBonus: this.idBonusActif, idUtilisateur: sessionStorage.getItem('idJoueur') };

    this.inventaireService.SupprimerBonusProchainePartie(DATA).subscribe(
      () =>
      {
        if(sessionStorage.getItem('idBonus') != null)
        {
          sessionStorage.removeItem('idBonus');
          this.idBonusActif = null;
        }
      
        this.bonusActuelle.qte = this.bonusActuelle.qte + 1;
        this.bonusActuelle = null;

        this.toastrServ.success("Le bonus " + _bonus.nomItem + " n'est plus actif", "Bonus inactif");

      },
      () =>
      {
        this.toastrServ.error("Vous n'êtes plus connecté(e) à internet", "Erreur");
      });
  }

  BonusActif(): boolean
  {
    return this.bonusActuelle != null ? true : false;
  }
}
