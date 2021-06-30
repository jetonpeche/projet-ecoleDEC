import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JeuService {

  constructor(private http: HttpClient) { }

  SupprimerSessionSave(): void
  {
    sessionStorage.removeItem('idSave');
    sessionStorage.removeItem('dataSave');
  }

  EnregistrerSave(_idSave: string, _vieA: string, vieJ: string): void
  {
    sessionStorage.setItem('idSave', _idSave);
    sessionStorage.setItem('dataSave', JSON.stringify({ vieJ: vieJ, vieA: _vieA }));
  }

  SauvegarderPartie(_info): Observable<any>
  {
    return this.http.post(`${environment.URL}jeu/sauvegarderPartie`, _info);
  }

  ReprendrePartie(_info): Observable<any>
  {
    return this.http.post(`${environment.URL}jeu/reprendrePartie`, _info);
  }

  SupprimerSauvegarde(_info): Observable<any>
  {
    return this.http.post(`${environment.URL}jeu/supprimerSauvegarde`, _info);
  }
}
