import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LogService } from '../services/log.service';

@Injectable({
  providedIn: 'root'
})
export class ConnexionGuard implements CanActivate 
{
  constructor(private logService: LogService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean 
  {
    if(this.logService.estConnecte)
      return true;
    else
    {
      this.router.navigate([""]);
      return false;
    }
      
  }
  
}
