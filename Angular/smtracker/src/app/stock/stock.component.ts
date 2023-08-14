import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, UntypedFormGroup } from '@angular/forms';
import * as Plotly from 'plotly.js-dist';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit, AfterViewInit {
  @ViewChild('gainersChartCanvas', { static: true }) gainersChartCanvas: ElementRef;
  @ViewChild('losersChartCanvas', { static: true }) losersChartCanvas: ElementRef;
  @Input() isShowHeader: boolean = true;
  stockForm: FormGroup;
  grainerData: any;
  stockChart: any;
  gainersTableBody: any;
  losersTableBody: any;
  gainersChart: Chart;
  losersChart: Chart;

  constructor(private formBuilder: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef) { 
  }

  ngOnInit(): void {
    this.stockForm = this.formBuilder.group({
      stockSymbol: ['AAPL'],
      timeDetail: ['TIME_SERIES_DAILY'],
      selectGainersLosers:[10]
    });

    this.gainersTableBody = document.getElementById('gainersTableBody');
    this.losersTableBody = document.getElementById('losersTableBody');
  }

  IsShowHeader(item: boolean) {
    this.isShowHeader = item;
  }

  ngAfterViewInit() {
    this.fetchStock();
    this.handleDropdownChange();
    this.cdr.detectChanges();

    window.addEventListener('resize', () => {
      this.fetchStock();
    });

  }

  fetchStock() {
    const API_KEY = 'DOSWKD9L3URZ6BUR'; // Replace with your actual API key
    const stockSymbol = this.stockForm.controls['stockSymbol'].value;
    const timeDetail = this.stockForm.controls['timeDetail'].value;
    const headerAP = this.headerAPIFromTimeDetail(timeDetail);
    const API_Call = `https://www.alphavantage.co/query?function=${timeDetail}&symbol=${stockSymbol}&apikey=${API_KEY}`;

    this.http.get(API_Call).subscribe(
      (data: any) => {
        const stockChartXValuesFunction = [];
        const stockChartYValuesFunction = [];

        for (let key in data[headerAP]) {
          stockChartXValuesFunction.push(key);
          stockChartYValuesFunction.push(data[headerAP][key]['1. open']);
        }

        this.renderStockChart(stockChartXValuesFunction, stockChartYValuesFunction);
      },
      (error) => {
        console.error('Error fetching stock data:', error);
      }
    );
  }

  headerAPIFromTimeDetail(timeDetail: string) {
    if (timeDetail === 'TIME_SERIES_WEEKLY_ADJUSTED') {
      return 'Weekly Adjusted Time Series';
    } else if (timeDetail === 'TIME_SERIES_DAILY') {
      return 'Time Series (Daily)';
    } else {
      return 'Monthly Time Series';
    }
  }

  renderStockChart(labels: any[], data: any[]) {
    if (this.stockChart) {
      Plotly.purge('stockChart');
    }

    this.stockChart = Plotly.newPlot(
      'stockChart',
      [
        {
          x: labels,
          y: data,
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: 'blue' },
        },
      ],
      {
        //width: '80%',
       // height: 400,
        responsive: true,
        title: this.stockForm.controls['stockSymbol'].value,
        margin: {
          l: 40,
          r: 40,
          t: 40,
          b: 40,
        },
      }
    );
  }



  onChangeStockSymbol() {
    this.fetchStock();
  }

  onChangeTimeDetail() {
    this.fetchStock();
  }

  // Gainer & Loser data
  handleDropdownChange() {
    Promise.all([this.fetchGainers(this.stockForm.controls['selectGainersLosers'].value), this.fetchLosers(this.stockForm.controls['selectGainersLosers'].value)])
      .then(([gainersData, losersData]) => {
        this.renderGainersTable(gainersData);
        this.renderLosersTable(losersData);

        const gainersLabels = gainersData.map((gainer: { symbol: any; }) => gainer.symbol);
        const gainersChangesPercentage = gainersData.map((gainer: { changesPercentage: string; }) => parseFloat(gainer.changesPercentage));
        this.createGainersChart(gainersLabels, gainersChangesPercentage);

        const losersLabels = losersData.map((loser: { symbol: any; }) => loser.symbol);
        const losersChangesPercentage = losersData.map((loser: { changesPercentage: string; }) => parseFloat(loser.changesPercentage));
        this.createLosersChart(losersLabels, losersChangesPercentage);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }


  onChangeGainerSelect() {
    this.handleDropdownChange();
  }

  // Function to fetch gainer data
  async fetchGainers(num : any) {
    try {
      const gainerAPI = 'be86972b1310bc955a9017b37c8bee78'; // Replace with your API key for gainers
      const gainerUrl = `https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=${gainerAPI}`;
      const response = await fetch(gainerUrl);
      this.grainerData = await response.json();
      return this.grainerData.slice(0, num);
    } catch (error) {
      console.error('Error fetching gainers:', error);
      return [];
    }
  }

  // Function to render the gainer table
  renderGainersTable(gainers: any[]) {
    this.gainersTableBody.innerHTML = '';

    gainers.forEach(gainer => {
      const row = document.createElement('tr');
      const symbolCell = document.createElement('td');
      symbolCell.textContent = gainer.symbol;
      const nameCell = document.createElement('td');
      nameCell.textContent = gainer.name;
      const priceCell = document.createElement('td');
      priceCell.textContent = gainer.price;
      const changesPercentageCell = document.createElement('td');
      changesPercentageCell.textContent = gainer.changesPercentage;

      row.appendChild(symbolCell);
      row.appendChild(nameCell);
      row.appendChild(priceCell);
      row.appendChild(changesPercentageCell);

      this.gainersTableBody.appendChild(row);
    });
  }

  // Function to fetch losers data
  async fetchLosers(num: any) {
  try {
    const loserAPI = 'be86972b1310bc955a9017b37c8bee78'; // Replace with your API key for losers
    const loserUrl = `https://financialmodelingprep.com/api/v3/stock_market/losers?apikey=${loserAPI}`;
    const response = await fetch(loserUrl);
    const data = await response.json();
    return data.slice(0, num);
  } catch (error) {
    console.error('Error fetching losers:', error);
    return [];
  }
}

  // Function to render the losers table
  renderLosersTable(losers: any[]) {
  this.losersTableBody.innerHTML = '';
  losers.forEach(loser => {
    const row = document.createElement('tr');
    const symbolCell = document.createElement('td');
    symbolCell.textContent = loser.symbol;
    const nameCell = document.createElement('td');
    nameCell.textContent = loser.name;
    const priceCell = document.createElement('td');
    priceCell.textContent = loser.price;
    const changesPercentageCell = document.createElement('td');
    changesPercentageCell.textContent = loser.changesPercentage;

    row.appendChild(symbolCell);
    row.appendChild(nameCell);
    row.appendChild(priceCell);
    row.appendChild(changesPercentageCell);

    this.losersTableBody.appendChild(row);
  });
  }

   // Function to create the gainers bar chart
  createGainersChart(labels: string[], data: number[]) {
    if (this.gainersChart) {
      this.gainersChart.destroy();
  }
     const colors = data.map((_: any, index: any) => this.getRandomColor());

    Chart.register(...registerables);

    this.gainersChart = new Chart(this.gainersChartCanvas?.nativeElement, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Change Percentage',
        data: data,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          type: 'linear',
          beginAtZero: true
        }
      }
    }
  });
}

  // Function to create the losers bar chart
  createLosersChart(labels: any, data: any) {
    if (this.losersChart) {
      this.losersChart.destroy();
  }

  const colors = data.map((_: any, index: any) => this.getRandomColor());

    this.losersChart = new Chart(this.losersChartCanvas?.nativeElement, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Change Percentage',
        data: data,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          type: 'linear',
          beginAtZero: true
        }
      }
    }
  });
  }

  // random color
  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
