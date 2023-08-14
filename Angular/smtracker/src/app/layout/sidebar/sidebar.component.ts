import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  url: string = "/dashboard";

  constructor(private router: Router, private location: Location) {
    this.url = this.location.path();
  }

  ngOnInit(): void {
  }

}
