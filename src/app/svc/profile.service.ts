import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Profile } from './Profile';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Quote } from './Quote';
import { History } from './History';
import { DatePipe } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  
  constructor(private http: HttpClient,public datepipe: DatePipe) {}

   private _profileurl: string = "https://financialmodelingprep.com/api/v3/company/profile/";
   //private _profileurl: string = "assets/profile.json";

  getProfiles(symbol): Observable<Profile> {
    return this.http.get<Profile>(this._profileurl+symbol)
      .pipe(retry(1),
        catchError(this.handleError)
      );
  }
  private _quoteurl: string = "https://financialmodelingprep.com/api/v3/quote/";
  //private _quoteurl: string = "assets/quote.json";

  getQuote(symbol): Observable<Quote[]> {
    return this.http.get<Quote[]>(this._quoteurl+symbol)
      .pipe(retry(1),
        catchError(this.handleError)
      );
  }

  private _historyurl1: string = "https://financialmodelingprep.com/api/v3/historical-price-full/"
  private _historyurl2: string = "?from=2007-03-12&to=";
  //private _historyurl: string = "assets/history.json";

  getHistory(symbol): Observable<History> {

      let datee;
      datee = new Date();
      let latest_date =this.datepipe.transform(datee, 'yyyy-MM-dd');
      console.log(latest_date);
      
     return this.http.get<History>(this._historyurl1+symbol+this._historyurl2+latest_date)
      .pipe(retry(3),
        catchError(this.handleError)
      );

  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
        // client-side error
        errorMessage = `Error: ${error.error.message}`;
    } else {
        // server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
 }
}
