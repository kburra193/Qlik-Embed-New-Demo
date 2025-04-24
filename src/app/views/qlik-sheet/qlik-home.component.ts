import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-qlik-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qlik-home.component.html',
  styleUrls: ['./qlik-home.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class QlikHomeComponent {
  appId = '615ed533-b2d0-48cc-8d43-db57cd809305';

  sheetIds = {
    sheet1: '22b069cd-0b39-44ed-9532-7b8d2c40256b',
    sheet2: 'a81af564-0a3f-4292-8866-6117ca5c64f7',
    sheet3: '6b026d08-5a6a-49dc-a474-d489557f8fb3'
  };

  sheetKeys = Object.keys(this.sheetIds) as Array<keyof typeof this.sheetIds>;
  currentSheetId: string = this.sheetIds.sheet1;

  filterPanelId = 'amSxjX';

  switchSheet(sheetId: string): void {
    console.log('Switching to:', sheetId);
    this.currentSheetId = sheetId;
  }
}
