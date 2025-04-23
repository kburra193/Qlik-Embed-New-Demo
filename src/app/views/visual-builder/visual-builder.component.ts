import {
  Component,
  ElementRef,
  ChangeDetectorRef,
  CUSTOM_ELEMENTS_SCHEMA,
  NgZone,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { QlikAPIService } from '../../services/qlik-api.service';

@Component({
  selector: 'app-visual-builder',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './visual-builder.component.html',
  styleUrl: './visual-builder.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VisualBuilderComponent {
  appId = '32718960-32ba-4f76-90b4-5c5796a7f1b8';
  masterDimensions: { id: string; label: string }[] = [];
  masterMeasures: { id: string; label: string }[] = [];

  selectedDimensions: string[] = [];
  selectedMeasures: string[] = [];
  selectedChartType: string = 'barchart';

  htmlString: SafeHtml = '';
  loading = false;

  chartTypes: string[] = [
    'scatterplot',
    'piechart',
    'barchart',
    'table',
    'linechart',
    'combochart',
  ];

  constructor(
    private el: ElementRef,
    private renderer: ElementRef,
    private sanitizer: DomSanitizer,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private qlikAPIService: QlikAPIService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.qlikAPIService.getMasterItems().then((data) => {
      this.masterDimensions = data.dimensions
        .filter((item) => item.id !== undefined)
        .map((item) => ({ id: item.id as string, label: item.label }));
      this.masterMeasures = data.measures
        .filter((item) => item.id !== undefined)
        .map((item) => ({ id: item.id as string, label: item.label }));
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  onToggle(label: string, type: 'dimension' | 'measure', event: any): void {
    if (type === 'dimension') {
      if (event.target.checked) {
        this.selectedDimensions.push(`[${label}]`);
      } else {
        this.selectedDimensions = this.selectedDimensions.filter((d) => d !== `[${label}]`);
      }
    } else {
      if (event.target.checked) {
        this.selectedMeasures.push(`[${label}]`);
      } else {
        this.selectedMeasures = this.selectedMeasures.filter((m) => m !== `[${label}]`);
      }
    }
  }

  submitSelection(): void {
    // Deduplicate
    this.selectedDimensions = Array.from(new Set(this.selectedDimensions));
    this.selectedMeasures = Array.from(new Set(this.selectedMeasures));

    console.log('✅ Selected Dimensions:', this.selectedDimensions);
    console.log('✅ Selected Measures:', this.selectedMeasures);
    console.log('✅ Selected Chart Type:', this.selectedChartType);

    this.createQlikEmbed();
  }

  private createQlikEmbed(): void {
    const dimString = this.selectedDimensions.map((d) => `"${d}"`).join(', ');
    const measString = this.selectedMeasures.map((m) => `"${m}"`).join(', ');

    const qlikEmbedHtml = `
    <qlik-embed
      id="visualization"
      ui="analytics/chart"
      app-id="${this.appId}"
      type="${this.selectedChartType}"
      dimensions='${JSON.stringify(this.selectedDimensions)}'
      measures='${JSON.stringify(this.selectedMeasures)}'
    ></qlik-embed>`;
  
    // Clear and set HTML
    this.htmlString = this.sanitizer.bypassSecurityTrustHtml('');
    this.htmlString = this.sanitizer.bypassSecurityTrustHtml(qlikEmbedHtml);
    this.cdr.detectChanges();

    // Manually trigger connectedCallback
    setTimeout(() => {
      const el = document.querySelector('qlik-embed');
      if (el) {
        customElements.whenDefined('qlik-embed').then(() => {
          (el as any).connectedCallback?.();
          console.log('✅ Qlik Embed rendered and hydrated:', qlikEmbedHtml);
        });
      }
    }, 100);
  }

  ngAfterViewInit(): void {
    this.createQlikEmbed();
  }
}
