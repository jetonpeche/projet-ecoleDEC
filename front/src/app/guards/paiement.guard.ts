import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { BoutiqueService } from '../services/boutique.service';

@Injectable({
  providedIn: 'root'
})
export class PaiementGuard implements CanActivate 
{
  constructor(private boutiqueService: BoutiqueService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean 
  {
    if(this.boutiqueService.pagnier.length > 0)
      return true;
    else
      return false;
  }
  
}
