import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HederComponent } from '../../shared/Componet/heder/heder.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-superamid',
  standalone: true,
  imports: [RouterOutlet,HederComponent],
  templateUrl: './superamid.component.html',
  styleUrl: './superamid.component.css'
})
export class SuperamidComponent implements OnInit{

  constructor(private Tituleservise: Title){}
  ngOnInit(): void {
    this.Tituleservise.setTitle('Orbitel admin');
  }
  
}
