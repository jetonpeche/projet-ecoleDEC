import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogService 
{
  estConnecte: boolean = false;

  constructor(private http: HttpClient) { }

  Connecter(_pseudo: string, _id: string, _idBonus: string, _token: string, _idSauvegarde: string, _vieJoueur: number = null, _vieAdversaire: number = null): void
  {
    this.estConnecte = true;

    sessionStorage.setItem('pseudo', _pseudo);
    sessionStorage.setItem('idJoueur', _id);
    sessionStorage.setItem('idBonus', _idBonus);

    if(_idSauvegarde != null)
    {
      sessionStorage.setItem('idSave', _idSauvegarde);
      sessionStorage.setItem('dataSave', JSON.stringify({ vieJ: _vieJoueur, vieA: _vieAdversaire }));
    }

    sessionStorage.removeItem('nbTentativeRestante');

    // pourquoi on utilise ca ?
    sessionStorage.setItem('token', _token);
  }

  SuppSessionStorage(): void
  {
    // garder le nb tentative restante
    if(sessionStorage.getItem('nbTentativeRestante') != null)
    {
      let nbTentative: string = sessionStorage.getItem('nbTentativeRestante');

      sessionStorage.clear();
      sessionStorage.setItem('nbTentativeRestante', nbTentative);
    }
    else
    {
      sessionStorage.clear();
      sessionStorage.setItem('nbTentativeRestante', "3");
    }
  }

  Deconnexion(): void
  {
    this.estConnecte = false;
    sessionStorage.clear();

    sessionStorage.setItem('nbTentativeRestante', "3");
  }

  Inscription(info: JSON): Observable<any>
  {
    return this.http.post(`${environment.URL}utilisateur/inscription`, info);
  }

  Connexion(info: JSON): Observable<any>
  {
    return this.http.post(`${environment.URL}utilisateur/connexion`, info);
  }
}
