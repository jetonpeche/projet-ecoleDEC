import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TabScore } from '../Type/TabScore';

@Injectable({
  providedIn: 'root'
})
export class TabScoreService 
{

  constructor(private http: HttpClient) { }

  ListerScore(): Observable<TabScore[]>
  {
    return this.http.get<TabScore[]>(`${environment.URL}tableauScore/listeScore`);
  }

  EnregistrerVictoireDefaite(_info): Observable<any>
  {
    return this.http.post<any>(`${environment.URL}tableauScore/enregistrerVictoireDefaite`, _info);
  }
}
