import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-modal-inscription',
  templateUrl: './modal-inscription.component.html',
  styleUrls: ['./modal-inscription.component.css']
})
export class ModalInscriptionComponent
{
  cache: boolean = true;
  cache2: boolean = true;

  constructor(private logService: LogService, private toastrServ: ToastrService, private refDiag: MatDialogRef<ModalInscriptionComponent>) { }

  Incription(form: NgForm): void
  {
    this.logService.Inscription(form.value).subscribe(
      (reponse) =>
      {
        if(reponse.status == 1)
        {
          this.toastrServ.success("Vous pouvez maintenant vous connectez", "Succes");
          setTimeout(() => {
            this.refDiag.close();
          }, 4000);
        }
        else
        {
          this.toastrServ.warning(reponse.data, "Erreur");
        }
      },
      () =>
      {
        this.toastrServ.error("Vous n'êtes plus connecté(e) à internet", "Erreur");
      });
  }
}
