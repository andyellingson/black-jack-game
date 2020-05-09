import { Component, OnInit, Input } from '@angular/core';
import { CardService } from '../card.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  service: CardService;
  value: number;
  imagePath: string;
  @Input() firstCard: boolean = false;
  @Input() public cardNumber: number = 0;

  constructor(private serv: CardService) { 
    this.service = serv;
  }

  ngOnInit(): void {
    // this.value = this.service.getValue(this.cardNumber);
    // this.imagePath = this.service.getImagePath(this.cardNumber);
  }
  
  update(): void {
    this.value = this.service.getValue(this.cardNumber);
    this.imagePath = this.service.getImagePath(this.cardNumber);
  }

}
