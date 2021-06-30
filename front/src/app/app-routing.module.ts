import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { BoutiqueComponent } from './components/boutique/boutique.component';
import { HistoriqueAchatComponent } from './components/historique-achat/historique-achat.component';
import { InventaireComponent } from './components/inventaire/inventaire.component';
import { JeuComponent } from './components/jeu/jeu.component';
import { PagnierComponent } from './components/pagnier/pagnier.component';
import { PaiementComponent } from './components/paiement/paiement.component';
import { TableauScoreComponent } from './components/tableau-score/tableau-score.component';

// Guards
import { ConnexionGuard } from './guards/connexion.guard';
import { PaiementGuard } from './guards/paiement.guard';

const routes: Routes = [
  { path: 'inventaire', canActivate:[ConnexionGuard], component: InventaireComponent },
  { path: 'jeu', component: JeuComponent },
  { path: 'boutique', component: BoutiqueComponent },
  { path: 'panier', component: PagnierComponent },
  { path: 'historique-achat', canActivate:[ConnexionGuard], component: HistoriqueAchatComponent },
  { path: 'tableau-score', component: TableauScoreComponent },

  { path: 'paiement', canActivate:[ConnexionGuard, PaiementGuard], component: PaiementComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }