import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gpt-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gpt-assistant.component.html',
})
export class GptAssistantComponent {
  userPrompt = '';
  response = '';

  constructor(private http: HttpClient) { }

  askGPT() {
    this.http.post<any>('http://localhost:3000/gpt', { prompt: this.userPrompt })
      .subscribe(res => {
        this.response = res.reply;
      });
  }
}
