import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-modal-connexion',
  templateUrl: './modal-connexion.component.html',
  styleUrls: ['./modal-connexion.component.css']
})
export class ModalConnexionComponent
{
  cache: boolean = true;

  constructor(private logService: LogService, private toastrServ: ToastrService, private refDilog: MatDialogRef<ModalConnexionComponent>) { }

  SeConnecter(form: NgForm): void
  {
    this.logService.Connexion(form.value).subscribe(
      (reponse) =>
      { 
        if(reponse.status == 1)
        { 
          if(reponse.data[0].idSauvegarde == null)
            this.logService.Connecter(reponse.data[0].pseudoUtilisateur, reponse.data[0].idUtilisateur, reponse.data[0].idBonusActif, reponse.token, reponse.data[0].idSauvegarde);
          else
            this.logService.Connecter(reponse.data[0].pseudoUtilisateur, reponse.data[0].idUtilisateur, reponse.data[0].idBonusActif, reponse.token, reponse.data[0].idSauvegarde, reponse.data[0].vieJoueur, reponse.data[0].vieAdvaisaire);

          this.refDilog.close();
        }
        else
        {
          this.toastrServ.warning("Login ou mode passe inccorect", "Erreur: connexion");
        }
      },
      () =>
      {
        this.toastrServ.error("Vous n'êtes plus connecté(e) à internet", "Erreur");
      }
    )
  }
}
