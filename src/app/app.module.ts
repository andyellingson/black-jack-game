import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'primeng/calendar';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CardComponent } from './card/card.component';
import { DynamicCardsContainerComponent } from './dynamic-cards-container/dynamic-cards-container.component';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import {ToolbarModule} from 'primeng/toolbar';
import { TooltipModule } from 'ng2-tooltip-directive';



@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    DynamicCardsContainerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CalendarModule,
    MenuModule,
    MenubarModule,
    DragDropModule,
    MessageModule,
    MessageModule,
    ToastModule,
    ButtonModule,
    ToolbarModule,
    TooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
