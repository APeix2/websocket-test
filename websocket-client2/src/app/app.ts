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
  imports: [MatButtonModule, MatCardModule, FormsModule, MatFormFieldModule, MatInputModule,MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('websocket-client2');
  private socket$: WebSocketSubject<any>;

  messages = signal<Messages[]>([]);
  myself = '蠟比比';

  sendMsg = signal('');

  constructor() {
    this.socket$ = webSocket('ws://localhost:1234');
  }

  ngOnInit() {
    this.getMessages().subscribe();
  }

  // Send a message to the server
  sendMessage(message: any) {
    const msg: Messages = {
      user: this.myself,
      text: message,
    };
    console.log(message);

    this.socket$.next(msg);
  }

  // Receive messages from the server
  getMessages(): Observable<Messages> {
    return this.socket$.asObservable().pipe(
      tap((message) => {
        this.messages.update((msgs) => [...msgs, message]);
      })
    );
  }

  // Close the WebSocket connection
  closeConnection() {
    this.socket$.complete();
  }
}
