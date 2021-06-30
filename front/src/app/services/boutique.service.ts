import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Boutique } from '../Type/Boutique';
import { Pagnier } from '../Type/Pagnier';

@Injectable({
  providedIn: 'root'
})
export class BoutiqueService 
{
  pagnier: Pagnier[] = [];

  constructor(private http: HttpClient) { }

  CalculPrixTotal(_prixItem: number, _qteChoisi: number): number 
  {
    return _prixItem * _qteChoisi;
  }

  AjouterPagnier(_item: Boutique, _qte: number): void
  {
    this.pagnier.push({ idItem: _item.idItem, prixItem: _item.prixItem, nomItem: _item.nomItem, qteChoisi: _qte });
  }

  ListerItemBoutique(): Observable<Boutique[]>
  {
    return this.http.get<Boutique[]>(`${environment.URL}boutique/listeItemBoutique`);
  }
}
