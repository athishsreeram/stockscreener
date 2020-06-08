import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Profile } from './Profile';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Quote } from './Quote';
import { History } from './History';
import { DatePipe } from '@angular/common';
import { StkLst } from './StkLst';
import { Financial, Income } from './Income';
import { Finratio } from './Finratio';
import { Fsg } from './Fsg';
import { Cmpmetric } from './Cmpmetric';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  
  key = "?apikey=98b3354924577aa37a8a6ef9dd823577"

  constructor(private http: HttpClient,public datepipe: DatePipe) {}

   private _profileurl: string = "https://financialmodelingprep.com/api/v3/company/profile/";
   //private _profileurl: string = "assets/profile.json";

  getProfiles(symbol): Observable<Profile> {
    return this.http.get<Profile>(this._profileurl+symbol+this.key)
      .pipe(retry(1),
        catchError(this.handleError)
      );
  }
  private _quoteurl: string = "https://financialmodelingprep.com/api/v3/quote/";
  //private _quoteurl: string = "assets/quote.json";

  getQuote(symbol): Observable<Quote[]> {
    return this.http.get<Quote[]>(this._quoteurl+symbol+this.key)
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
      
     return this.http.get<History>(this._historyurl1+symbol+this._historyurl2+latest_date+this.key)
      .pipe(retry(3),
        catchError(this.handleError)
      );

  }
  
  private _stkLst: string = "https://financialmodelingprep.com/api/v3/company/stock/list";

  getStkLst(): Observable<StkLst> {
    return this.http.get<StkLst>(this._stkLst+this.key)
      .pipe(retry(1),
        catchError(this.handleError)
      );
  }


  private _incomeLst: string = "https://financialmodelingprep.com/api/v3/financials/income-statement/";

  getFinancials(symbol): Observable<Income> {
    return this.http.get<Income>(this._incomeLst+symbol+this.key)
      .pipe(retry(1),
        catchError(this.handleError)
      );
  }


  private _fsgLst: string = "https://financialmodelingprep.com/api/v3/financial-statement-growth/";

  getFsg(symbol): Observable<Fsg> {
    return this.http.get<Fsg>(this._fsgLst+symbol+this.key)
      .pipe(retry(1),
        catchError(this.handleError)
      );
  }

  private _cmpMetricLst: string = "https://financialmodelingprep.com/api/v3/company-key-metrics/";

  getCmpmetric(symbol): Observable<Cmpmetric> {
    return this.http.get<Cmpmetric>(this._cmpMetricLst+symbol+this.key)
      .pipe(retry(1),
        catchError(this.handleError)
      );
  }

  private _frurl: string = "https://financialmodelingprep.com/api/v3/financial-ratios/";
  //private _frurl: string = "assets/quote.json";

  getFinratio(symbol): Observable<Finratio> {
    return this.http.get<Finratio>(this._frurl+symbol+this.key)
      .pipe(retry(1),
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
