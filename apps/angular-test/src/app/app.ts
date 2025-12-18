import { Component, signal } from '@angular/core';
import data from '../assets/users.json';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-test');
  usuarios = data["results"].slice(10);
}
