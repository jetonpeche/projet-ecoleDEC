import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { JeuService } from 'src/app/services/jeu.service';
import { LogService } from 'src/app/services/log.service';
import { ModalJeuComponent } from '../modal-jeu/modal-jeu.component';

@Component({
  selector: 'app-jeu',
  templateUrl: './jeu.component.html',
  styleUrls: ['./jeu.component.css']
})
export class JeuComponent
{
  reprendrePartie: boolean;
  nbTentative: number;

  constructor(private dialog: MatDialog, private toastrServ: ToastrService, private jeuService: JeuService, private logService: LogService) { }

  Jouer(): void
  {
    // confirmation supp save
    if(this.reprendrePartie)
    {
      if(confirm("Si vous continuer votre sauvegarde sera effacée"))
      {
        const DATA = { idJoueur: sessionStorage.getItem('idJoueur'), idSave: sessionStorage.getItem("idSave") };

        this.jeuService.SupprimerSauvegarde(DATA).subscribe(
          () =>
          {
            this.toastrServ.success("Votre sauvegarde à été supprimée", "Suppression réussi");
            this.jeuService.SupprimerSessionSave();

            this.dialog.open(ModalJeuComponent, { disableClose: true, data: { reprendre: false }});
          },
          () =>
          {
            this.toastrServ.error("Vous n'êtes plus connecté(e) à internet", "Erreur");
          }
        );
      }
    }
    else
    {
      const DIALOG_REF = this.dialog.open(ModalJeuComponent, { disableClose: true, data: { reprendre: false }});
      DIALOG_REF.afterClosed().subscribe(
        () =>
        {
          this.SetTentativeRestante();
        }
      );
    }
  }

  JouerPasConnecter(): void
  {
    this.SetTentativeRestante();

    if(this.nbTentative > 0)
    {
      const DIALOG_REF = this.dialog.open(ModalJeuComponent, { disableClose: true, data: { reprendre: false }});
      DIALOG_REF.afterClosed().subscribe(
        () =>
        {
          this.SetTentativeRestante();
        }
      );
    }
    else
    {
      this.toastrServ.info("Vous n'avez plus de tentative, inscrivez vous pour plus jouer", "Plus de tentative");
    }
  }

  ReprendrePartie(): void
  {
    const DIALOG_REF = this.dialog.open(ModalJeuComponent, { disableClose: true, data: { reprendre: true }});
    DIALOG_REF.afterClosed().subscribe(
      () =>
      {
        this.SetTentativeRestante();
      }
    );
  }

  PartieReprise(): boolean
  {
    return this.reprendrePartie = sessionStorage.getItem("idSave") == null ? false : true;
  }

  EstConnecter(): boolean
  {
    return this.logService.estConnecte;
  }

  private SetTentativeRestante(): void
  {
    if(sessionStorage.getItem('nbTentativeRestante') != null)
      this.nbTentative = +sessionStorage.getItem('nbTentativeRestante');
  }
}
