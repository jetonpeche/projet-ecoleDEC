import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BoutiqueService } from 'src/app/services/boutique.service';
import { Boutique } from 'src/app/Type/Boutique';
import { Pagnier } from 'src/app/Type/Pagnier';

@Component({
  selector: 'app-boutique',
  templateUrl: './boutique.component.html',
  styleUrls: ['./boutique.component.css']
})
export class BoutiqueComponent implements OnInit
{
  listeItem: Boutique[] = [];
  pagnier: Pagnier[] = [];

  erreurHttp: boolean = false;

  constructor(private boutiqueService: BoutiqueService, private toastrServ: ToastrService, private router: Router) { }

  ngOnInit(): void
  {
    this.boutiqueService.ListerItemBoutique().subscribe(
      (liste: Boutique[]) =>
      {       
        this.listeItem = liste["data"];
      },
      () =>
      {
        this.toastrServ.error("Vous n'êtes plus connecté(e) à internet", "Erreur");
      });
  }

  AjouterPagnier(_qte: number, _item: Boutique): void
  { 
    if(_qte > 0)
    {
      this.boutiqueService.AjouterPagnier(_item, _qte);

      this.toastrServ.success(_item.nomItem + "est ajouté au pagnié", "Ajout");
    }
    else
    {
      this.toastrServ.warning("Veuillez choisir une quantité supérieur à 0", "Attention");
    }
  }
}
