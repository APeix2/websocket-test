import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('websocket-client');
  private socket$: WebSocketSubject<any>;

  constructor() {
    this.socket$ = webSocket('ws://localhost:1234');
  }

  ngOnInit() {
    this.getMessages().subscribe();
  }

  // Send a message to the server
  sendMessage(message: any) {
    this.socket$.next(message);
  }

  // Receive messages from the server
  getMessages(): Observable<any> {
    return this.socket$
      .asObservable()
      .pipe(tap((message) => console.log('Received message:', message)));
  }

  // Close the WebSocket connection
  closeConnection() {
    this.socket$.complete();
  }
}
