import { Component, OnInit, afterNextRender, effect, signal, untracked } from '@angular/core';
import { FabaHarness } from '../faba-harness.service';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ MatCardModule ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  usuarios = signal<any[]>([]);
  private auditoriaIniciada = false;
  private auditoriaInstancy = false;

  constructor(private http: HttpClient, private faba: FabaHarness) {
    // El effect detecta cambios en las señales de forma automática
    effect(() => {
      const data = this.usuarios();
      
      if (data.length > 0 && !this.auditoriaIniciada) {
        // Marcamos como iniciado para no repetir la auditoría
        this.auditoriaIniciada = true;
        this.auditoriaInstancy = true;
        
        // Usamos un pequeño delay o un microtask para asegurar que 
        // Angular haya terminado de volcar los 1000 usuarios al DOM
        console.log('📊 Señal con datos detectada. Preparando auditoría...');
      }
    });

    afterNextRender(() => {
      if (this.auditoriaInstancy){
        this.auditoriaInstancy = false;
        this.faba.startAuditory();
      }
    });
  }

  ngOnInit() {
    this.http.get<any>('assets/users.json').subscribe(data => {
      this.usuarios.set(data.results);
    });
  }
}