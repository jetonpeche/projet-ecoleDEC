 import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

// modals
import { ModalConnexionComponent } from './components/modal-connexion/modal-connexion.component';
import { ModalInscriptionComponent } from './components/modal-inscription/modal-inscription.component';
import { LogService } from './services/log.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit
{
  pseudo: string = "";

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(private breakpointObserver: BreakpointObserver, public dialog: MatDialog, private logService: LogService) {}

  ngOnInit(): void
  {
    if(sessionStorage.getItem("idJoueur") != null)
    {
      this.logService.estConnecte = true;
    }
    else
    {
      this.logService.SuppSessionStorage();
    }              
  }

  OuvrirModalConnexion(): void
  {
    this.dialog.open(ModalConnexionComponent, {});
  }

  OuvrirModalInscription(): void
  {
    this.dialog.open(ModalInscriptionComponent, {});
  }

  Deconnexion(): void
  {
    this.logService.Deconnexion();
  }

  EstConnecter(): boolean
  {
    return this.logService.estConnecte;
  }

  AfficherPseudo(): string
  {
    if(sessionStorage.getItem('pseudo') != null)
      return sessionStorage.getItem('pseudo');
  }
}
