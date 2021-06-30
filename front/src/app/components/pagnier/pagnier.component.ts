import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BoutiqueService } from 'src/app/services/boutique.service';
import { Pagnier } from 'src/app/Type/Pagnier';

@Component({
  selector: 'app-pagnier',
  templateUrl: './pagnier.component.html',
  styleUrls: ['./pagnier.component.css']
})
export class PagnierComponent implements OnInit 
{
  pagnier: Pagnier[] = [];

  msg: string;

  msgAfficher: boolean = false;
  erreurHttp: boolean = false;

  constructor(private boutiqueService: BoutiqueService, private toastrServ: ToastrService, private router: Router) { }

  ngOnInit(): void 
  {
    this.pagnier = this.boutiqueService.pagnier;
    this.pagnier = this.AddictionItemIdentique();
  }

  CalculPrixTotal(_prixItem: number, _qteChoisi: number): number 
  {
    return this.boutiqueService.CalculPrixTotal(_prixItem, _qteChoisi);
  }

  SupprimerElementPagnier(_id: string): void
  {
    if (confirm("confirmation pour retirer cette article du pagnier")) 
    {
      const INDEX = this.pagnier.findIndex(item => item.idItem == _id);
      this.pagnier.splice(INDEX, 1);

      this.boutiqueService.pagnier = this.pagnier;
      
      this.toastrServ.success("L'item à été supprimé du pagnier", "Element retiré");
    }
  }

  Payer(): void
  {
    if(sessionStorage.getItem('idJoueur') != null)
    {
      this.router.navigate(['/paiement']); 
    }
    else
    {
      this.toastrServ.error("Pour continuer il faut vous connectez", "Pas connecter");
    }
  }

  PagnierVide(): boolean
  {
    return this.pagnier.length == 0 ? true : false;
  }

  private AddictionItemIdentique(): Pagnier[]
  {
    let liste: Pagnier[] = [];

    for (const ELEMENT of this.pagnier) 
    {
      const ITEM_LIST = this.pagnier.filter(item => item.idItem == ELEMENT.idItem);

      // cherche si l'item n'est pas deja dedans
      const EXIST = liste.find(item => item.idItem == ELEMENT.idItem);

      if(EXIST == null)
      {
        if(ITEM_LIST.length > 1)
        {
          let qteTotal: number = 0;

          for (const ELEMENT_2 of ITEM_LIST)
          {
            qteTotal = qteTotal + +ELEMENT_2.qteChoisi;
          }

          liste.push({ idItem: ELEMENT.idItem, prixItem:  ELEMENT.prixItem, nomItem: ELEMENT.nomItem, qteChoisi: qteTotal });
        }
        else
        {
          liste.push({ idItem: ELEMENT.idItem, prixItem:  ELEMENT.prixItem, nomItem: ELEMENT.nomItem, qteChoisi: +ELEMENT.qteChoisi });
        }
      }
    }

    return liste;
  }
}
