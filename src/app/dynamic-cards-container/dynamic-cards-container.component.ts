import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentFactory, ComponentRef } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CardComponent } from '../card/card.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dynamic-cards-container',
  templateUrl: './dynamic-cards-container.component.html',
  styleUrls: ['./dynamic-cards-container.component.css'],
  providers: [MessageService]
})

export class DynamicCardsContainerComponent implements OnInit {
  playerAces: number[] = [];
  dealerAces: number[] = [];
  dealerCards: CardComponent[] = [];
  playerCards: CardComponent[] = [];
  theDeck: CardComponent[] = [];
  Bank: number = 500;
  Bet: number = 0;
  Total: number = 0;
  DealerTotal: number = 0;
  gameOver: boolean = true;
  NoHitYet: boolean = true;
  messageText: string;
  timer: any;
  flippedCard: boolean;
  card: any;
  firstHand: boolean = true;
  isDoubled: boolean = true;

  @ViewChild("playerCardContainer", { read: ViewContainerRef }) playerContainer;
  @ViewChild("dealerCardContainer", { read: ViewContainerRef }) dealerContainer;
  constructor(private resolver: ComponentFactoryResolver, private messageService: MessageService) { 
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(){}

  createPlayerCardComponent(cardIndex: number) {
    if(cardIndex >= 48 && cardIndex <= 51)
    {
      this.playerAces.push(1);
    }
    const factory: ComponentFactory<CardComponent> = this.resolver.resolveComponentFactory(CardComponent);
    let componentRef = this.playerContainer.createComponent(factory);
    (<CardComponent>componentRef.instance).cardNumber = cardIndex;
    (<CardComponent>componentRef.instance).firstCard = (this.playerCards.length === 0);
    (<CardComponent>componentRef.instance).update();
    this.Total += (<CardComponent>componentRef.instance).value;
    if(this.Total > 21) 
    {
      if(this.playerAces.length > 0)
      {
        this.playerAces.pop();
        this.Total -= 10;
      }else{
        this.gameOver = true;
        this.showToastMessage("error", "You Lose!!", "You Busted!!"); 
        this.Bank -= this.Bet;
        this.StartDealersTurn();
      }
    }
    this.playerCards.push(<CardComponent>componentRef);
  }

  createDealerCardComponent(cardIndex: number) {
    if(cardIndex >= 48 && cardIndex <= 51)
    {
      this.dealerAces.push(1);
    }

    //check if there is a flippedCard
    if(this.flippedCard){
      //remove last card
      this.card.destroy();
      this.flippedCard = false;
      this.dealerCards.pop();
    }
    
    //create new card
    const factory: ComponentFactory<CardComponent> = this.resolver.resolveComponentFactory(CardComponent);
    let componentRef = this.dealerContainer.createComponent(factory);
    (<CardComponent>componentRef.instance).cardNumber = cardIndex;
    (<CardComponent>componentRef.instance).firstCard = (this.dealerCards.length === 0);
    (<CardComponent>componentRef.instance).update();
    if(cardIndex === 52)//back of card
    {
      (<CardComponent>componentRef.instance).value = 0;
      this.card = componentRef;
      this.flippedCard = true;
    }else{
      this.DealerTotal += (<CardComponent>componentRef.instance).value;
    }
    this.dealerCards.push(<CardComponent>componentRef);
  }

  drop(event: CdkDragDrop<string[]>) {
    if(event.previousContainer !== event.container){
      console.log("transer to other row. From " + event.previousContainer.id  + " To: " + event.container.id + " index1: " + event.previousIndex + " index2: " + event.currentIndex);
      transferArrayItem(event.previousContainer.data, event.container.data , event.previousIndex, event.currentIndex);

    }
    else {
      console.log("transer to other same. From " + event.previousContainer.id + " To: " + event.container.id + " index1: " + event.previousIndex + " index2: " + event.currentIndex);
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      console.log(this.theDeck[0].value);
    }
  }

  HitMe(){
    this.PlaySound("card-flip.wav");
    if(!this.NoHitYet)
    {
      this.NoHitYet = false;
    }

    this.createPlayerCardComponent(this.randomInt(0,51));  
  }

  Stay(){
    this.StartDealersTurn();
  }

  HitDealer(backSide: boolean = false){
    this.PlaySound("card-flip.wav");
    if(!backSide){
      this.createDealerCardComponent(this.randomInt(0,51));
    } else  {
      this.createDealerCardComponent(52);
    }
  }

  PlaySound(soundFileName: string){
    var audio = new Audio();
    audio.src = "../../../assets/sound/" + soundFileName;
    audio.load();
    audio.play();
  }

  IsBet():boolean{
    return this.Bet > 0;
  }

  BetMoney(bet: number, isDouble: boolean = false): void{
    if(this.Bank - (this.Bet + bet) >= 0)
    {
      this.PlaySound("poker-chips4.wav");
      if(isDouble)
      {
        this.Bank -= this.Bet;
        this.isDoubled = true;
        this.HitMe();
        this.StartDealersTurn();
      }
      else{
        this.Bet += bet;  
      }
    }
  }

  CanDouble():boolean{
    return !(this.NoHitYet && (this.Total === 10 || this.Total === 11));
  }

  StartDealersTurn(){
    if(this.gameOver)
    {
      //flip card and stop
      this.createDealerCardComponent(this.randomInt(0,51));
    }else{
      this.timer = setInterval(() => {
        this.DealersTurn(); 
        }, 500);
    }
  }

  DealersTurn(){
    //dealer stands on all 17s
    if(this.DealerTotal <= 16){
      this.HitDealer();
    }else{
       //greater than 16
       if(this.DealerTotal > 21){
          //check for dealer aces
          if(this.dealerAces.length > 0)
          {
            this.dealerAces.pop();
            console.log("Remove dealer ace. Aces Left: " + this.dealerAces.length)
            this.DealerTotal -= 10;
          }else{
            this.PlaySound("win-spacey.wav");
            this.gameOver = true;
            this.showToastMessage("info", "You Win!!", "Dealer Busted. You won $" + this.Bet);
            this.EndDealerTurn();  
            this.Bank += (this.isDoubled ? 4 : 2) * this.Bet;
          }
        }else{
          //dealer between 17 and 21
          if(this.DealerTotal < this.Total){
            this.PlaySound("win-spacey.wav");
            this.gameOver = true;
            this.showToastMessage("info", "You Won $" + this.Bet, "You beat the dealer's Hand!");  
            this.EndDealerTurn(); 
            this.Bank += (this.isDoubled ? 4 : 2) * this.Bet; 
          }else if(this.DealerTotal === this.Total){
            this.PlaySound("retro-you-lose-sfx.wav");
            this.gameOver = true;
            this.showToastMessage("warn", "Tie", "Push!!"); 
            this.Bank += (this.isDoubled ? 2 : 1) * this.Bet; 
            this.EndDealerTurn();   
          }else{
            this.PlaySound("retro-you-lose-sfx.wav");
            this.gameOver = true;
            this.showToastMessage("error", "You Lose", "Dealer Wins");
            this.EndDealerTurn(); 
           // this.Bank -= this.Bet;   
          }
        }          
      }
    }

    EndDealerTurn(){
      clearInterval(this.timer);
    }
    
    showToastMessage(sev: string, sum: string, det: string) {
    this.messageService.add({
        severity: sev,
        summary: sum,
        detail: det,
        life:1000
    });
  }
  
  ClearBet(){
    this.Bet = 0;
  }

  CanPlay():boolean{
    return this.Bank - this.Bet >= 0;
  }

  Play(){
    
    // if(!this.firstHand)
    //   this.Bank -= this.Bet;
    // else  
    //   this.firstHand = false;

    this.Bank -= this.Bet;

    this.NoHitYet = true;
    this.isDoubled = false;
    this.gameOver = false;
    this.flippedCard = false;
    this.dealerAces = [];
    this.playerAces = [];
    this.Total = 0;
    this.DealerTotal = 0;
    this.playerCards = [];
    this.dealerCards = [];
    this.playerContainer.clear();
    this.dealerContainer.clear();
    this.EndDealerTurn();
    this.HitDealer();
    this.HitDealer(true);
    this.HitMe();
    this.HitMe();
  }

   /**
 * generate a random integer between min and max
 * @param {Number} min 
 * @param {Number} max
 * @return {Number} random generated integer 
 */
  randomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
