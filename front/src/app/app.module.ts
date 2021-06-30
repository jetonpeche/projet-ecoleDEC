import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

// angular mat
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';

// components
import { AppComponent } from './app.component';
import { ModalConnexionComponent } from './components/modal-connexion/modal-connexion.component';
import { ModalInscriptionComponent } from './components/modal-inscription/modal-inscription.component';
import { ModalJeuComponent } from './components/modal-jeu/modal-jeu.component';
import { BoutiqueComponent } from './components/boutique/boutique.component';
import { JeuComponent } from './components/jeu/jeu.component';
import { InventaireComponent } from './components/inventaire/inventaire.component';
import { PagnierComponent } from './components/pagnier/pagnier.component';
import { PaiementComponent } from './components/paiement/paiement.component';
import { TableauScoreComponent } from './components/tableau-score/tableau-score.component';

// services
import { LogService } from './services/log.service';
import { BoutiqueService } from './services/boutique.service';
import { InventaireService } from './services/inventaire.service';
import { JeuService } from './services/jeu.service';
import { TabScoreService } from './services/tab-score.service';
import { HistoriqueService } from './services/historique.service';

// j'ai vue que sa permet de donner la possibilité de refrech la page en mode prod en ajoutant un # sur URL (pas test)
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HistoriqueAchatComponent } from './components/historique-achat/historique-achat.component';

@NgModule({
  declarations: [
    AppComponent,
    ModalConnexionComponent,
    ModalInscriptionComponent,
    BoutiqueComponent,
    JeuComponent,
    InventaireComponent,
    PagnierComponent,
    PaiementComponent,
    ModalJeuComponent,
    HistoriqueAchatComponent,
    TableauScoreComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,

    // snackBar
    ToastrModule.forRoot({
        timeOut: 3000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-bottom-right'
      })
    ],

  // utilisation des pages modals
  entryComponents: [ModalConnexionComponent, ModalInscriptionComponent, ModalJeuComponent],
  
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, TabScoreService, HistoriqueService, JeuService, LogService, BoutiqueService, InventaireService],
  bootstrap: [AppComponent]
})
export class AppModule { }
