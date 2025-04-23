import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],  // Include RouterOutlet if you're using routing
  templateUrl: './app.component.html',  // Your component template
  styleUrls: ['./app.component.scss'],  // Your component styles
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Enable the use of custom elements like <qlik-embed>
})
export class AppComponent {
  title = 'churn-insights-app';
}