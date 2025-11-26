import { Component, signal } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Observable, tap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
interface Messages {
  user: string;
  text: string;
}

@Component({
  selector: 'app-root',
  imports: [
    MatButtonModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('websocket-client');
  private socket$: WebSocketSubject<any>;

  messages = signal<Messages[]>([]);
  myself = '臭小狗';

  sendMsg = signal('');

  constructor() {
    this.socket$ = webSocket('ws://localhost:1234');
  }

  ngOnInit() {
    this.getMessages().subscribe();
  }

  // 發送訊息給 server
  sendMessage(message: any) {
    const msg: Messages = {
      user: this.myself,
      text: message,
    };
    console.log(message);

    this.socket$.next(msg);
  }

  // 接收來自 server 的訊息
  getMessages(): Observable<Messages> {
    return this.socket$.asObservable().pipe(
      tap((message) => {
        this.messages.update((msgs) => [...msgs, message]);
      })
    );
  }

  // 關閉 WebSocket 連線
  closeConnection() {
    this.socket$.complete();
  }
}
