import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BoutiqueService } from 'src/app/services/boutique.service';
import { HistoriqueService } from 'src/app/services/historique.service';
import { Historique } from 'src/app/Type/Historique';

@Component({
  selector: 'app-historique-achat',
  templateUrl: './historique-achat.component.html',
  styleUrls: ['./historique-achat.component.css']
})
export class HistoriqueAchatComponent implements OnInit {

  listeHistorique = [];

  constructor(private toastrServ: ToastrService, private histoAchat: HistoriqueService, private boutiqueService: BoutiqueService) { }

  ngOnInit(): void 
  {
    const DATA = { idUtilisateur: sessionStorage.getItem('idJoueur') };

    this.histoAchat.ListerHistorique(DATA).subscribe(
      (liste) =>
      {
        if(liste.data.length > 0)
          this.ConstruireJSON(liste.data);
        else
          this.toastrServ.info("Vous n'avez pas fait d'achat", "Aucun achat");
      },
      () =>
      {
        this.toastrServ.error("Vous n'etes pas connecté(e) à internet", "erreur réseau");
      });
  }

  CalculPrixTotal(_prixItem: number, _qteChoisi: number): number 
  {
    return this.boutiqueService.CalculPrixTotal(_prixItem, _qteChoisi);
  }

  CalculTotalCommande(_liste): number
  {
    let total = 0;

    for (const element of _liste)
    {
      total += this.CalculPrixTotal(element.prixItem, element.qte);
    }

    return total;
  }

  private ConstruireJSON(_liste: Historique[]): void
  {
    let _date: Date;
    
    for (const element of _liste)
    {
      if(element.dateAchat != _date)
      {
        _date = element.dateAchat;

        const LISTE_ITEM = _liste.filter(item => item.dateAchat == element.dateAchat);

        this.listeHistorique.push({ dateAchat: element.dateAchat, listeItem: LISTE_ITEM });  
      }
    }
  }
}
