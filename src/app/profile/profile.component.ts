import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../svc/profile.service';
import { Profile } from '../svc/Profile';
import { Quote } from '../svc/Quote';
import { History } from '../svc/History';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profiles: Profile;
  quotes: Quote[];
  err: String;
  symbol: String;
  history: History;
  data: any;

  constructor(private profileService: ProfileService) { }

  ngOnInit() {

  }



  getProfile() {

    if (this.symbol != "") {

      this.profileService.getHistory(this.symbol).
        subscribe(
          data => {
            this.history = data;

            let chartLabel = new Array();
            let chartData = new Array();

            for (var i = 0; i < this.history.historical.length; i++) {
              chartLabel.push(this.history.historical[i].date.toString());
              chartData.push(this.history.historical[i].close.toString());
            }

            this.data = {
              labels: chartLabel,
              datasets: [
                {
                  label: 'Price',
                  data: chartData,
                  fill: false,
                  borderColor: '#4bc0c0'
                }
              ]
            }

          },
          error => {
            this.err = error;
          });


      this.profileService.getProfiles(this.symbol).
        subscribe(data => this.profiles = data,
          error => this.err = error);

      this.profileService.getQuote(this.symbol).
        subscribe(data => this.quotes = data,
          error => this.err = error);



    } else {
      console.log("empty symbol")
    }
  }


}
