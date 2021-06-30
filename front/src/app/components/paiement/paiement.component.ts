import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { render } from 'creditcardpayments/creditCardPayments';
import { ToastrService } from 'ngx-toastr';
import { BoutiqueService } from 'src/app/services/boutique.service';
import { InventaireService } from 'src/app/services/inventaire.service';
import { Pagnier } from 'src/app/Type/Pagnier';

type ItemPagnier = 
{
  idItem: string,
  idUtilisateur: string,
  qte: number
}

@Component({
  selector: 'app-paiement',
  templateUrl: './paiement.component.html',
  styleUrls: ['./paiement.component.css']
})
export class PaiementComponent implements OnInit {

  private totalApayer: number = 0;
  private pagnier: Pagnier[];

  constructor(private boutiqueService: BoutiqueService, private router: Router, private inventaireService: InventaireService, private toastrServ: ToastrService) { }

  ngOnInit(): void
  {
    this.pagnier = this.boutiqueService.pagnier;
    this.totalApayer = this.CalculPrixTotalPagnier();
    
    render({
        id : "#btnPaypal",
        currency: "CAD",
        value: this.totalApayer.toString(),

        onApprove: (_infos) =>
        {
          this.AjouterInventaire();
        }
      });
  }

  AjouterInventaire(): void
  {
    const DATA = this.CreationJson();

    this.inventaireService.AjouterPagnierInventaire(DATA).subscribe(
      () =>
      {
        this.pagnier = this.boutiqueService.pagnier = [];
  
        this.toastrServ.success("Les bonus ont étés ajoutées à votre inventaire", "Element Ajoutés");
        this.router.navigate([""]);
      },
      () =>
      {
        this.toastrServ.error("Vous n'êtes plus connecté(e) à internet", "Erreur");
      });
  }
  
  private CreationJson(): ItemPagnier[]
  {
    let liste: ItemPagnier[] = [];

    for (const ELEMENT of this.pagnier)
    {
      liste.push({ idItem: ELEMENT.idItem, idUtilisateur: sessionStorage.getItem('idJoueur'), qte: ELEMENT.qteChoisi });  
    }

    return liste;
  }

  private CalculPrixTotalPagnier(): number
  {
    let total: number = 0;

    for (const ELEMENT of this.pagnier)
    {
      total += (ELEMENT.prixItem *  ELEMENT.qteChoisi);
    }

    return total;
  }
}
