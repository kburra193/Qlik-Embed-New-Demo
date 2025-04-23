import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import { QlikAPIService } from '../../services/qlik-api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-visual-builder',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './visual-builder.component.html',
  styleUrls: ['./visual-builder.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VisualBuilderComponent {
  appId = '32718960-32ba-4f76-90b4-5c5796a7f1b8';
  masterDimensions: { id: string; label: string }[] = [];
  masterMeasures: { id: string; label: string }[] = [];

  selectedDimensions: string[] = ['rfm_score_group'];
  selectedMeasures: string[] = ['Churn Rate'];

  selectedChartType: string = 'barchart';
  htmlString: SafeHtml = '';

  chartTypes: string[] = [
    'scatterplot',
    'piechart',
    'barchart',
    'table',
    'linechart',
    'combochart',
  ];

  loading = false;

  constructor(
    private qlikAPIService: QlikAPIService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.qlikAPIService.getMasterItems().then((data) => {
      this.masterMeasures = data.measures.map((measure) => ({
        id: measure.id + '',
        label: measure.label as string,
      }));
      this.masterDimensions = data.dimensions.map((dimension) => ({
        id: dimension.id + '',
        label: dimension.label as string,
      }));
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  submitSelection(): void {
    // Just deduplicate — no need to wrap here anymore
    this.selectedDimensions = Array.from(new Set(this.selectedDimensions));
    this.selectedMeasures = Array.from(new Set(this.selectedMeasures));
  
    console.log('✅ Selected Dimensions:', this.selectedDimensions);
    console.log('✅ Selected Measures:', this.selectedMeasures);
    console.log('✅ Selected Chart Type:', this.selectedChartType);
  
    this.createQlikEmbed();
  }

  onToggle(label: string, type: 'dimension' | 'measure', event: any): void {
    if (type === 'dimension') {
      if (event.target.checked) {
        this.selectedDimensions.push(label);
      } else {
        this.selectedDimensions = this.selectedDimensions.filter((l) => l !== label);
      }
    } else {
      if (event.target.checked) {
        this.selectedMeasures.push(label);
      } else {
        this.selectedMeasures = this.selectedMeasures.filter((l) => l !== label);
      }
    }
  }

  private createQlikEmbed(): void {
    // DO NOT wrap, assume already "[rfm_score_group]" format
    const dimensions = this.selectedDimensions.map((d) => `"${d}"`).join(', ');
    const measures = this.selectedMeasures.map((m) => `"${m}"`).join(', ');
  
    const qlikEmbedHtml = `
      <qlik-embed
        id="visualization"
        ui="analytics/chart"
        app-id="${this.appId}"
        type="${this.selectedChartType}"
        dimensions='[${dimensions}]'
        measures='[${measures}]'>
      </qlik-embed>`;
  
    this.htmlString = this.sanitizer.bypassSecurityTrustHtml('');
    this.htmlString = this.sanitizer.bypassSecurityTrustHtml(qlikEmbedHtml);
  
    this.cdr.detectChanges();
  
    console.log('✅ Rendered htmlString:', qlikEmbedHtml);
  }
  
  
}
