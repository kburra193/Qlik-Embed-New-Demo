import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-qlik-sheet',
  imports: [],
  templateUrl: './qlik-sheet.component.html',
  styleUrl: './qlik-sheet.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Enable the use of custom elements like <qlik-embed>
})
export class QlikSheetComponent {

}
