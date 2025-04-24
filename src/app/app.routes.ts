import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QlikHomeComponent } from './views/qlik-sheet/qlik-home.component';
import { D3VisualComponent } from './views/d3-visual/d3-visual.component';
import { GptAssistantComponent } from './views/gpt-assistant/gpt-assistant.component';
import { VisualBuilderComponent } from './views/visual-builder/visual-builder.component';


export const routes: Routes = [
  { path: '', redirectTo: 'qlik', pathMatch: 'full' },
  { path: 'qlik', component: QlikHomeComponent },
  { path: 'd3', component: D3VisualComponent },
  { path: 'gpt', component: GptAssistantComponent },
  { path: 'builder', component: VisualBuilderComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
