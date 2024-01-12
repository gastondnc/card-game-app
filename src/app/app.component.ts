import { Component } from '@angular/core';
import { NEW_CARDS, NEW_DECK } from './utils/deck-api';
import { Card, CardsResponse, Deck } from './models/deck.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'Card Game';
  public newDeckUrl: string = NEW_DECK;
  public newCardsUrl: string = NEW_CARDS;
  public newDeck: Partial<Deck> = {};
  public newCards: Card[] = [];


  constructor() {
    this.getNewDeck(this.newDeckUrl);

  }

  // Llamamos al Endpoint que nos trae el mazo de cartas //
  getNewDeck(url: string) {
    fetch(url)
      .then(resp => resp.json())
      .then((data: Deck) => {
        console.log(data)
        this.newDeck = data
        this.getNewCards(this.newCardsUrl)
      })
  }

  // Llamada al EndPoint que nos trae las cartas //
  getNewCards(urlCards: string) {
    console.log('NEWDECK', this.newDeck);
    urlCards = urlCards.replace('<<deck_id>>', this.newDeck.deck_id!)
    fetch(urlCards)
      .then(resp => resp.json())
      .then((data: CardsResponse) => {
        console.log(data)
        this.mapCards(data.cards)
      })
  }

  // Mapeamos las Cartas que nos llegan por el endpoint para poder cambiar su propiedad value por un número //
  mapCards(cards: Card[]) {
    this.newCards = cards.map(card => {
      if (isNaN(Number(card.value)) === true) {
        console.log('NaN', card.value)
        card.value = this.transformValues(card.value.toString())
      }
      card.value = Number(card.value)
      return card
    })
    console.log(this.newCards)
  }

  // Transfomamos los valores que nos llegan de las Cards AS, JACK, QUEEN, KING //
  transformValues(cardValue: string): string {
    switch (cardValue) {
      case 'AS':
        return '1'

      case 'JACK':
        return '11'

      case 'QUEEN':
        return '12'

      case 'KING':
        return '13'

      default:
        return '0'
    }
  }












}
