import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnInit {
  text!: string;

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      this.text = 'Just a few seconds more...';
    }, 12000);
  }
}
