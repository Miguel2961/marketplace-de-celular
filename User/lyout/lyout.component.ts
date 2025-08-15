import { Component, OnInit } from '@angular/core';
import { HederComponent } from '../../shared/Componet/heder/heder.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../shared/Componet/footer/footer.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-lyout',
  standalone: true,
  imports: [RouterOutlet, HederComponent,FooterComponent],
  templateUrl: './lyout.component.html',
  styleUrl: './lyout.component.css'
})
export  class LyoutComponent implements OnInit{

  constructor(private titleService: Title){}
  ngOnInit(): void {
    this.titleService.setTitle('Orbitel');
  }

}
