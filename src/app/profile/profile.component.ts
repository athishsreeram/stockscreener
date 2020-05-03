import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../svc/profile.service';
import { Profile } from '../svc/Profile';
import { Quote } from '../svc/Quote';
import { History } from '../svc/History';
import { ActivatedRoute } from '@angular/router';
import { Financial } from '../svc/Income';
import { Fsg, Growth } from '../svc/Fsg';

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

  colsIncome: any[];
  colsFsgRatio: any[];

  financialLst: Financial[];
  growthLst: Growth[];


  constructor(private profileService: ProfileService, private route: ActivatedRoute) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get("symbol");

    if (id != null) {
      this.symbol = id;
      this.getProfile();
    }
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
        subscribe(data => {
          this.profiles = data;

        },
          error => this.err = error);

      this.profileService.getQuote(this.symbol).
        subscribe(data => this.quotes = data,
          error => this.err = error);

      this.colsIncome = [
        {
          field: "date", header: "date"
        },
        {
          field: "Revenue", header: "Revenue"
        },
        {
          field: "Revenue Growth", header: "Revenue Growth"
        },
        {
          field: "Cost of Revenue", header: "Cost of Revenue"
        },
        {
          field: "Gross Profit", header: "Gross Profit"
        },
        {
          field: "R&D Expenses", header: "R&D Expenses"
        },
        {
          field: "SG&A Expense", header: "SG&A Expense"
        },
        {
          field: "Operating Expenses", header: "Operating Expenses"
        },
        {
          field: "Operating Income", header: "Operating Income"
        },
        {
          field: "Interest Expense", header: "Interest Expense"
        },
        {
          field: "Earnings before Tax", header: "Earnings before Tax"
        },
        {
          field: "Income Tax Expense", header: "Income Tax Expense"
        },
        {
          field: "Net Income - Non-Controlling int", header: "Net Income - Non-Controlling int"
        },
        {
          field: "Net Income - Discontinued ops", header: "Net Income - Discontinued ops"
        },
        {
          field: "Net Income", header: "Net Income"
        },
        {
          field: "Preferred Dividends", header: "Preferred Dividends"
        },
        {
          field: "Net Income Com", header: "Net Income Com"
        },
        {
          field: "EPS", header: "EPS"
        },
        {
          field: "EPS Diluted", header: "EPS Diluted"
        },
        {
          field: "Weighted Average Shs Out", header: "Weighted Average Shs Out"
        },
        {
          field: "Weighted Average Shs Out (Dil)", header: "Weighted Average Shs Out (Dil)"
        },
        {
          field: "Dividend per Share", header: "Dividend per Share"
        },
        {
          field: "Gross Margin", header: "Gross Margin"
        },
        {
          field: "EBITDA Margin", header: "EBITDA Margin"
        },
        {
          field: "EBIT Margin", header: "EBIT Margin"
        },
        {
          field: "Profit Margin", header: "Profit Margin"
        },
        {
          field: "Free Cash Flow margin", header: "Free Cash Flow margin"
        },
        {
          field: "EBITDA", header: "EBITDA"
        },
        {
          field: "EBIT", header: "EBIT"
        },
        {
          field: "Consolidated Income", header: "Consolidated Income"
        },
        {
          field: "Earnings Before Tax Margin", header: "Earnings Before Tax Margin"
        },
        {
          field: "Net Profit Margin", header: "Net Profit Margin"
        }
      ];

      this.colsFsgRatio = [
        { field: "date", header: "date" },
        { field: "Gross Profit Growth", header: "Gross Profit Growth" },
        { field: "EBIT Growth", header: "EBIT Growth" },
        { field: "Operating Income Growth", header: "Operating Income Growth" },
        { field: "Net Income Growth", header: "Net Income Growth" },
        { field: "EPS Growth", header: "EPS Growth" },
        { field: "EPS Diluted Growth", header: "EPS Diluted Growth" },
        { field: "Weighted Average Shares Growth", header: "Weighted Average Shares Growth" },
        { field: "Weighted Average Shares Diluted Growth", header: "Weighted Average Shares Diluted Growth" },
        { field: "Dividends per Share Growth", header: "Dividends per Share Growth" },
        { field: "Operating Cash Flow growth", header: "Operating Cash Flow growth" },
        { field: "Free Cash Flow growth", header: "Free Cash Flow growth" },
        { field: "10Y Revenue Growth (per Share)", header: "10Y Revenue Growth (per Share)" },
        { field: "5Y Revenue Growth (per Share)", header: "5Y Revenue Growth (per Share)" },
        { field: "3Y Revenue Growth (per Share)", header: "3Y Revenue Growth (per Share)" },
        { field: "10Y Operating CF Growth (per Share)", header: "10Y Operating CF Growth (per Share)" },
        { field: "5Y Operating CF Growth (per Share)", header: "5Y Operating CF Growth (per Share)" },
        { field: "3Y Operating CF Growth (per Share)", header: "3Y Operating CF Growth (per Share)" },
        { field: "10Y Net Income Growth (per Share)", header: "10Y Net Income Growth (per Share)" },
        { field: "5Y Net Income Growth (per Share)", header: "5Y Net Income Growth (per Share)" },
        { field: "3Y Net Income Growth (per Share)", header: "3Y Net Income Growth (per Share)" },
        { field: "10Y Shareholders Equity Growth (per Share)", header: "10Y Shareholders Equity Growth (per Share)" },
        { field: "5Y Shareholders Equity Growth (per Share)", header: "5Y Shareholders Equity Growth (per Share)" },
        { field: "3Y Shareholders Equity Growth (per Share)", header: "3Y Shareholders Equity Growth (per Share)" },
        { field: "10Y Dividend per Share Growth (per Share)", header: "10Y Dividend per Share Growth (per Share)" },
        { field: "5Y Dividend per Share Growth (per Share)", header: "5Y Dividend per Share Growth (per Share)" },
        { field: "3Y Dividend per Share Growth (per Share)", header: "3Y Dividend per Share Growth (per Share)" },
        { field: "Receivables growth", header: "Receivables growth" },
        { field: "Inventory Growth", header: "Inventory Growth" },
        { field: "Asset Growth", header: "Asset Growth" },
        { field: "Book Value per Share Growth", header: "Book Value per Share Growth" },
        { field: "Debt Growth", header: "Debt Growth" },
        { field: "R&D Expense Growth", header: "R&D Expense Growth" },
        { field: "SG&A Expenses Growth", header: "SG&A Expenses Growth" }
      ];

      this.profileService.getFinancials(this.symbol).
        subscribe(data => {
          this.financialLst = data.financials;
          console.log(data);
        },
          error => this.err = error);

      this.profileService.getFsg(this.symbol).
        subscribe(data => this.growthLst = data.growth,
          error => this.err = error);

    } else {
      console.log("empty symbol")
    }
  }


}
