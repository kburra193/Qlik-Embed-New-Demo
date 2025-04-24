import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-qlik-embed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qlik-home.component.html',
  styleUrls: ['./qlik-home.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class QlikHomeComponent {
  appId = '615ed533-b2d0-48cc-8d43-db57cd809305'; // Replace with actual Qlik App ID
  objectId = 'GRAR'; // Replace with actual object ID (chart)
  sheetId = '22b069cd-0b39-44ed-9532-7b8d2c40256b'; // Replace with actual sheet ID
}
