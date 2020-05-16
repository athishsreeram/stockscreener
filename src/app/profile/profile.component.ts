import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../svc/profile.service';
import { Profile } from '../svc/Profile';
import { Quote } from '../svc/Quote';
import { History } from '../svc/History';
import { ActivatedRoute } from '@angular/router';
import { Financial } from '../svc/Income';
import { Fsg, Growth } from '../svc/Fsg';
import * as $ from 'jquery';
import { InvestmentValuationRatios } from '../svc/Finratio';
import "datatables.net";
import "datatables.net-dt"; 

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
  colsCmpmetric: any[];
  colInvestmentValuationRatios: any[];

  financialLst: Financial[];
  growthLst: Growth[];
  metricsLst: { [key: string]: string }[];
  ratiosLst: InvestmentValuationRatios[];

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
        { field: "date", header: "Date" },
        { field: "Revenue", header: "Revenue" },
        { field: "Revenue Growth", header: "Revenue Growth" },
        { field: "Cost of Revenue", header: "Cost of Revenue" },
        { field: "Gross Profit", header: "Gross Profit" },
        { field: "R&D Expenses", header: "R&D Expenses" },
        { field: "SG&A Expense", header: "SG&A Expense" },
        { field: "Operating Expenses", header: "Operating Expenses" },
        { field: "Operating Income", header: "Operating Income" },
        { field: "Interest Expense", header: "Interest Expense" },
        { field: "Earnings before Tax", header: "Earnings before Tax" },
        { field: "Income Tax Expense", header: "Income Tax Expense" },
        { field: "Net Income - Non-Controlling int", header: "Net Income - Non-Controlling int" },
        { field: "Net Income - Discontinued ops", header: "Net Income - Discontinued ops" },
        { field: "Net Income", header: "Net Income" },
        { field: "Preferred Dividends", header: "Preferred Dividends" },
        { field: "Net Income Com", header: "Net Income Com" },
        { field: "EPS", header: "EPS" },
        { field: "EPS Diluted", header: "EPS Diluted" },
        { field: "Weighted Average Shs Out", header: "Weighted Average Shs Out" },
        { field: "Weighted Average Shs Out (Dil)", header: "Weighted Average Shs Out (Dil)" },
        { field: "Dividend per Share", header: "Dividend per Share" },
        { field: "Gross Margin", header: "Gross Margin" },
        { field: "EBITDA Margin", header: "EBITDA Margin" },
        { field: "EBIT Margin", header: "EBIT Margin" },
        { field: "Profit Margin", header: "Profit Margin" },
        { field: "Free Cash Flow margin", header: "Free Cash Flow margin" },
        { field: "EBITDA", header: "EBITDA" },
        { field: "EBIT", header: "EBIT" },
        { field: "Consolidated Income", header: "Consolidated Income" },
        { field: "Earnings Before Tax Margin", header: "Earnings Before Tax Margin" },
        { field: "Net Profit Margin", header: "Net Profit Margin" }
      ];

      this.colsFsgRatio = [
        { field: "date", header: "Date" },
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

      this.colsCmpmetric = [
        {	field:	"date" 	,	header: "Date" 	}	,
        {	field:	"Revenue per Share" 	,	header:	"Revenue per Share" 	}	,
        {	field:	"Net Income per Share" 	,	header:	"Net Income per Share" 	}	,
        {	field:	"Operating Cash Flow per Share" 	,	header:	"Operating Cash Flow per Share" 	}	,
        {	field:	"Free Cash Flow per Share" 	,	header:	"Free Cash Flow per Share" 	}	,
        {	field:	"Cash per Share" 	,	header:	"Cash per Share" 	}	,
        {	field:	"Book Value per Share" 	,	header:	"Book Value per Share" 	}	,
        {	field:	"Tangible Book Value per Share" 	,	header:	"Tangible Book Value per Share" 	}	,
        {	field:	"Shareholders Equity per Share" 	,	header:	"Shareholders Equity per Share" 	}	,
        {	field:	"Interest Debt per Share" 	,	header:	"Interest Debt per Share" 	}	,
        {	field:	"Market Cap" 	,	header:	"Market Cap" 	}	,
        {	field:	"Enterprise Value" 	,	header:	"Enterprise Value" 	}	,
        {	field:	"PE ratio" 	,	header:	"PE ratio" 	}	,
        {	field:	"Price to Sales Ratio" 	,	header:	"Price to Sales Ratio" 	}	,
        {	field:	"POCF ratio" 	,	header:	"POCF ratio" 	}	,
        {	field:	"PFCF ratio" 	,	header:	"PFCF ratio" 	}	,
        {	field:	"PB ratio" 	,	header:	"PB ratio" 	}	,
        {	field:	"PTB ratio" 	,	header:	"PTB ratio" 	}	,
        {	field:	"EV to Sales" 	,	header:	"EV to Sales" 	}	,
        {	field:	"Enterprise Value over EBITDA" 	,	header:	"Enterprise Value over EBITDA" 	}	,
        {	field:	"EV to Operating cash flow" 	,	header:	"EV to Operating cash flow" 	}	,
        {	field:	"EV to Free cash flow" 	,	header:	"EV to Free cash flow" 	}	,
        {	field:	"Earnings Yield" 	,	header:	"Earnings Yield" 	}	,
        {	field:	"Free Cash Flow Yield" 	,	header:	"Free Cash Flow Yield" 	}	,
        {	field:	"Debt to Equity" 	,	header:	"Debt to Equity" 	}	,
        {	field:	"Debt to Assets" 	,	header:	"Debt to Assets" 	}	,
        {	field:	"Net Debt to EBITDA" 	,	header:	"Net Debt to EBITDA" 	}	,
        {	field:	"Current ratio" 	,	header:	"Current ratio" 	}	,
        {	field:	"Interest Coverage" 	,	header:	"Interest Coverage" 	}	,
        {	field:	"Income Quality" 	,	header:	"Income Quality" 	}	,
        {	field:	"Dividend Yield" 	,	header:	"Dividend Yield" 	}	,
        {	field:	"Payout Ratio" 	,	header:	"Payout Ratio" 	}	,
        {	field:	"SG&A to Revenue" 	,	header:	"SG&A to Revenue" 	}	,
        {	field:	"R&D to Revenue" 	,	header:	"R&D to Revenue" 	}	,
        {	field:	"Intangibles to Total Assets" 	,	header:	"Intangibles to Total Assets" 	}	,
        {	field:	"Capex to Operating Cash Flow" 	,	header:	"Capex to Operating Cash Flow" 	}	,
        {	field:	"Capex to Revenue" 	,	header:	"Capex to Revenue" 	}	,
        {	field:	"Capex to Depreciation" 	,	header:	"Capex to Depreciation" 	}	,
        {	field:	"Stock-based compensation to Revenue" 	,	header:	"Stock-based compensation to Revenue" 	}	,
        {	field:	"Graham Number" 	,	header:	"Graham Number" 	}	,
        {	field:	"ROIC" 	,	header:	"ROIC" 	}	,
        {	field:	"Return on Tangible Assets" 	,	header:	"Return on Tangible Assets" 	}	,
        {	field:	"Graham Net-Net" 	,	header:	"Graham Net-Net" 	}	,
        {	field:	"Working Capital" 	,	header:	"Working Capital" 	}	,
        {	field:	"Tangible Asset Value" 	,	header:	"Tangible Asset Value" 	}	,
        {	field:	"Net Current Asset Value" 	,	header:	"Net Current Asset Value" 	}	,
        {	field:	"Invested Capital" 	,	header:	"Invested Capital" 	}	,
        {	field:	"Average Receivables" 	,	header:	"Average Receivables" 	}	,
        {	field:	"Average Payables" 	,	header:	"Average Payables" 	}	,
        {	field:	"Average Inventory" 	,	header:	"Average Inventory" 	}	,
        {	field:	"Days Sales Outstanding" 	,	header:	"Days Sales Outstanding" 	}	,
        {	field:	"Days Payables Outstanding" 	,	header:	"Days Payables Outstanding" 	}	,
        {	field:	"Days of Inventory on Hand" 	,	header:	"Days of Inventory on Hand" 	}	,
        {	field:	"Receivables Turnover" 	,	header:	"Receivables Turnover" 	}	,
        {	field:	"Payables Turnover" 	,	header:	"Payables Turnover" 	}	,
        {	field:	"Inventory Turnover" 	,	header:	"Inventory Turnover" 	}	,
        {	field:	"ROE" 	,	header:	"ROE" 	}	,
        {	field:	"Capex per Share" 	,	header:	"Capex per Share" 	}
      ];

      this.colInvestmentValuationRatios = [
        {	field:	"date" 	,	header: "Date" 	}	,
        {	field:	"priceBookValueRatio" 	,	header:	"priceBookValueRatio" 	}	,
        {	field:	"priceToBookRatio" 	,	header:	"priceToBookRatio" 	}	,
        {	field:	"priceToSalesRatio" 	,	header:	"priceToSalesRatio" 	}	,
        {	field:	"priceEarningsRatio" 	,	header:	"priceEarningsRatio" 	}	,
        {	field:	"receivablesTurnover" 	,	header:	"receivablesTurnover" 	}	,
        {	field:	"priceToFreeCashFlowsRatio" 	,	header:	"priceToFreeCashFlowsRatio" 	}	,
        {	field:	"priceToOperatingCashFlowsRatio" 	,	header:	"priceToOperatingCashFlowsRatio" 	}	,
        {	field:	"priceCashFlowRatio" 	,	header:	"priceCashFlowRatio" 	}	,
        {	field:	"priceEarningsToGrowthRatio" 	,	header:	"priceEarningsToGrowthRatio" 	}	,
        {	field:	"priceSalesRatio" 	,	header:	"priceSalesRatio" 	}	,
        {	field:	"dividendYield" 	,	header: "DividendYield" 	}	,
        {	field:	"enterpriseValueMultiple" 	,	header:	"enterpriseValueMultiple" 	}	,
        {	field:	"priceFairValue" 	,	header:	"priceFairValue" 	}		
      ];

      this.profileService.getFinancials(this.symbol).
        subscribe(data => {
          this.financialLst = data.financials;

          this.transposeTable();

        },
          error => this.err = error);

      this.profileService.getFsg(this.symbol).
        subscribe(data => this.growthLst = data.growth,
          error => this.err = error);

      this.profileService.getCmpmetric(this.symbol).
        subscribe(data => this.metricsLst = data.metrics,
          error => this.err = error);

      this.profileService.getFinratio(this.symbol).
        subscribe(
          data => {

            this.ratiosLst = new Array(data.ratios.length - 1);

            for(var i=0;i< data.ratios.length; i++){
              this.ratiosLst[i]=(data.ratios[i].investmentValuationRatios);
              this.ratiosLst[i].date=data.ratios[i].date;
            }
          },
            error => this.err = error);    

    } else {
      console.log("empty symbol");
    }
  }

  transposeTable() {
    $(function () {


      $("#fitbl").find("[role=grid]").attr("id","fiTable");
       $("#ckmtbl").find("[role=grid]").attr("id","ckmTable");
       $("#krtbl").find("[role=grid]").attr("id","krTable");

       $('#fiTable').DataTable({
         paging: false,
         autoWidth: true
        });

        $('#fiTable').wrap("<div style='overflow-x:auto;'>");
        $('#fiTable').css("width","6000px");
       
        $("#fgtbl").find("[role=grid]").attr("id","fgTable");
       
       $('#fgTable').DataTable({
        paging: false,
        autoWidth: true
       });
      
       $('#fgTable').wrap("<div style='overflow-x:auto;'>");
       $('#fgTable').css("width","6000px");
      
       $('#ckmTable').DataTable({
        paging: false,
        autoWidth: true
       });

       $('#ckmTable').wrap("<div style='overflow-x:auto;'>");
        $('#ckmTable').css("width","12000px");
       
       $('#krTable').DataTable({
        paging: false,
        autoWidth: true
       });

       $('#krTable').wrap("<div style='overflow-x:auto;'>");
        $('#krTable').css("width","6000px");
       
      
    });
  }


}

