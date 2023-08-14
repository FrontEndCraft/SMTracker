import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ConvertorComponent } from '../convertor/convertor.component';
import { StockComponent } from '../stock/stock.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild(StockComponent, { static: false }) stockComponent: StockComponent;
  @ViewChild(ConvertorComponent, { static: false }) convertorComponent: ConvertorComponent;
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.stockComponent.IsShowHeader(false);
    this.convertorComponent.IsShowHeader(false);
  }

}
