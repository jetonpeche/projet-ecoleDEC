import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistoriqueService 
{
  constructor(private http: HttpClient) { }

  ListerHistorique(_info): Observable<any>
  {
    return this.http.post<any>(`${environment.URL}historique/listeHistorique`, _info);
  }
}
