import { Component, OnInit } from '@angular/core';
import { SymbolsList } from '../svc/StkLst';
import { ProfileService } from '../svc/profile.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  stkLst: SymbolsList[];
  err: String;
  cols: any[];

  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.getStk();
  }

  getStk(){

    this.cols = [
      { field: 'symbol', header: 'Symbol' },
      { field: 'name', header: 'Name' },
      { field: 'price', header: 'Price' },
      { field: 'exchange', header: 'Exchange' }
   ];

      this.profileService.getStkLst().
        subscribe(data => this.stkLst = data.symbolsList,
          error => this.err = error);
  }

}
