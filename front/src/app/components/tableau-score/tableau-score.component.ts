import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TabScoreService } from 'src/app/services/tab-score.service';
import { TabScore } from 'src/app/Type/TabScore';

@Component({
  selector: 'app-tableau-score',
  templateUrl: './tableau-score.component.html',
  styleUrls: ['./tableau-score.component.css']
})
export class TableauScoreComponent implements OnInit {

  listeScore: TabScore[];

  constructor(private toastrServ: ToastrService, private tabScoreServ: TabScoreService) { }

  ngOnInit(): void 
  {
    this.tabScoreServ.ListerScore().subscribe(
      (liste: TabScore[]) =>
      {
        this.listeScore = liste["data"];
      },
      () =>
      {
        this.toastrServ.error("Vous n'êtes plus connecté(e) à internet", "Erreur");
      }
    )
  }

}
