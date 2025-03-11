import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TelegramService {
  private botToken: string = '7582597139:AAG-Kb7ixAvJ_K_OMuQlE3rgHRjZ34G1jxI';
  private apiUrl: string = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
  private defaultChatId: string = '1656204996'; // ID predeterminado

  constructor(private http: HttpClient) { }

  // Envía el mensaje al API de Telegram con chat_id opcional
  sendMessage(text: string, chatId?: string): Observable<any> {
    const body = {
      chat_id: chatId || this.defaultChatId, // Usa el chatId recibido o el predeterminado
      text: text
    };
    return this.http.post(this.apiUrl, body);
  }
}
