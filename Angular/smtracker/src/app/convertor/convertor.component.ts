import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
//import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@Component({
  selector: 'app-convertor',
  templateUrl: './convertor.component.html',
  styleUrls: ['./convertor.component.scss']
})
export class ConvertorComponent implements OnInit, AfterViewInit {
  @ViewChild('exchangeRateChartCanvas') exchangeRateChartCanvas: ElementRef<HTMLCanvasElement>;
  @Input() isShowHeader: boolean = true;
  chart: Chart;
  convertorForm: FormGroup;
  sourceCurrencySelect: any;
  destinationCurrencySelect: any;
  tableBody: any;
  convertedAmount: string;
  constructor(private http: HttpClient,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.convertorForm = this.formBuilder.group({
      sourceCurrency: ['USD'],
      destinationCurrency: ['USD'],
      amount: ['']
    });

    this.fetchCurrencyRates().then(currencyRates => {
      this.initCurrencyDropdowns(currencyRates);
    });

    this.updateTable();
  }

  IsShowHeader(item: boolean) {
    this.isShowHeader = item;
  }


  ngAfterViewInit() {
    this.updateChart();
    this.cdr.detectChanges();
  }


  fetchCurrencyRates(): Promise<any> {
    const apiKey = '5d8b9157d1c096dd9eb5449d';
    const baseCurrency = 'USD';
    const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`;

    return this.http.get(apiUrl).toPromise()
      .then((data: any) => {
        if (data.result === 'success') {
          return data.conversion_rates;
        } else {
          console.error('API Error:', data['error-type']);
          return {};
        }
      })
      .catch(error => {
        console.error('Fetch Error:', error);
        return {};
      });
  }

  initCurrencyDropdowns(currencyRates: any): void {
    const currencyCodes = Object.keys(currencyRates);
    this.sourceCurrencySelect = document.getElementById('sourceCurrency');
    this.destinationCurrencySelect = document.getElementById('destinationCurrency');

    for (const currencyCode of currencyCodes) {
      const option = document.createElement('option');
      option.value = currencyCode;
      option.textContent = currencyCode.toUpperCase();
      this.sourceCurrencySelect?.appendChild(option);
      this.destinationCurrencySelect?.appendChild(option.cloneNode(true));
    }

    // Fill the dropdown menu with currency options for the chart
    const currencyPairSelect = document.getElementById('currencyPairSelect') as HTMLSelectElement;
    for (const currency of currencyCodes) {
      const option = document.createElement('option');
      option.value = currency;
      option.textContent = currency.toUpperCase();
      currencyPairSelect.appendChild(option);
    }

    // Get the default selected currency pairs for the chart
    const defaultSelectedCurrencies = ['eur', 'gbp', 'jpy', 'aud', 'cad', 'chf', 'cny', 'sek', 'nzd', 'mxn', 'sgd', 'hkd', 'nok', 'krw', 'try'];

    // Split the default selected currencies and set them as selected in the currencyPairSelect element
    defaultSelectedCurrencies.forEach(currency => {
      const option = currencyPairSelect.querySelector(`option[value="${currency}"]`) as HTMLOptionElement;
      if (option) {
        option.selected = true;
      }
    });

    // Update the chart on DOM load
    this.updateChart();
  }


  convertCurrency(): void {
    const sourceCurrency = this.convertorForm.controls['sourceCurrency'].value;
    const destinationCurrency = this.convertorForm.controls['destinationCurrency'].value;
    const amount = parseFloat(this.convertorForm.controls['amount'].value);

    if (!isNaN(amount)) {
      this.fetchCurrencyRates().then(currencyRates => {
        const convertedAmount = this.calculateConvertedAmount(amount, sourceCurrency, destinationCurrency, currencyRates);
        this.convertedAmount = `${amount} ${sourceCurrency.toUpperCase()} = ${convertedAmount.toFixed(2)} ${destinationCurrency.toUpperCase()}`
      });
    } else {
      alert('Please enter a valid amount.');
    }
  }

  calculateConvertedAmount(amount: number, sourceCurrency: string, destinationCurrency: string, currencyRates: any): number {
    const baseCurrency = 'USD';
    if (sourceCurrency === baseCurrency) {
      return amount * currencyRates[destinationCurrency];
    } else if (destinationCurrency === baseCurrency) {
      return amount / currencyRates[sourceCurrency];
    } else {
      return (amount / currencyRates[sourceCurrency]) * currencyRates[destinationCurrency];
    }
  }

  generateRandomColors(count: number): string[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const color = `rgba(${this.getRandomNumber(0, 255)}, ${this.getRandomNumber(0, 255)}, ${this.getRandomNumber(0, 255)}, 0.7)`;
      colors.push(color);
    }
    return colors;
  }

  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  updateChart(): void {
    Chart.register(...registerables);
    const currencyPairSelect = document.getElementById('currencyPairSelect') as HTMLSelectElement;
    const selectedOptions = currencyPairSelect.selectedOptions;
    const selectedCurrencies = Array.from(selectedOptions).map(option => option.value);

    this.fetchCurrencyRates().then(currencyRates => {
      // Get the selected currency pairs and their exchange rates
      const labels = selectedCurrencies.map(currency => currency.toUpperCase());
      const exchangeRates = selectedCurrencies.map(currency => currencyRates[currency]);

      // Create the chart or update the existing one
    //  const ctx = this.exchangeRateChartCanvas.nativeElement.getContext('2d');
      if (this.chart) {
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = exchangeRates;
        this.chart.data.datasets[0].backgroundColor = this.generateRandomColors(selectedCurrencies.length);
        this.chart.update();
      } else {
        const colors = this.generateRandomColors(labels.length);
        this.chart = new Chart(this.exchangeRateChartCanvas?.nativeElement, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Exchange Rates',
              data: exchangeRates,
              backgroundColor: colors,
              borderWidth: 1,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                type: 'linear',
                beginAtZero: true
              }
            },
            plugins: {
              legend: {
                display: false,
              }
            }
          }
        });
      }
    });
  }

  async updateTable() {
    const apiKey = '5d8b9157d1c096dd9eb5449d';
    const baseCurrency = 'USD';
    const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.result === 'success') {
        const rates = data.conversion_rates;
        this.tableBody = document.getElementById('exchangeRateTable');

        // Clear existing table data
        this.tableBody.innerHTML = '';

        // Loop through all currency pairs and add rows to the table
        for (const currency in rates) {
          const exchangeRate = rates[currency];
          const row = document.createElement('tr');
          const currencyPairCell = document.createElement('td');
          const exchangeRateCell = document.createElement('td');

          currencyPairCell.textContent = `USD/${currency}`;
          exchangeRateCell.textContent = exchangeRate.toFixed(4);

          row.appendChild(currencyPairCell);
          row.appendChild(exchangeRateCell);
          this.tableBody.appendChild(row);
        }
      } else {
        console.error('API Error:', data['error-type']);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  }

  onChangeSourceCurrency() {
    this.convertCurrency();
  }

  onChangeDestinationCurrency() {
    this.convertCurrency();
  }
}
