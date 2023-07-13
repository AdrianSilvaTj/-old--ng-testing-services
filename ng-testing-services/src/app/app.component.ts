import { Component } from '@angular/core';
import { Calculator } from './calculator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-testing-services';

  ngOnInit(){
    const calc = new Calculator();
    console.log(calc.divide(5,8));
    console.log(calc.divide(5,0));

  }
}
