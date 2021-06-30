import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Inventaire } from '../Type/Inventaire';

@Injectable({
  providedIn: 'root'
})
export class InventaireService {

  constructor(private http: HttpClient) { }

  ListeInventaire(_info): Observable<Inventaire[]>
  {
    return this.http.post<Inventaire[]>(`${environment.URL}inventaire/listeInventaire`, _info);
  }

  AjouterPagnierInventaire(_info): Observable<any[]>
  {   
    return this.http.post<any[]>(`${environment.URL}inventaire/ajouterInventaire`, _info);
  }

  AjouterBonusProchainePartie(_info): Observable<any>
  {
    return this.http.post(`${environment.URL}inventaire/ajouterBonusProchainePartie`, _info);;
  }

  SupprimerBonusProchainePartie(_info): Observable<any>
  {
    return this.http.post(`${environment.URL}inventaire/supprimerBonusProchainePartie`, _info);
  }
}
