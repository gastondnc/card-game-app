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
  public isLoading: boolean = false;
  public isDraw: boolean = false;
  public isShowModal: boolean = false;
  public newDeckUrl: string = NEW_DECK;
  public newCardsUrl: string = NEW_CARDS;
  public newDeck: Partial<Deck> = {};
  public handCards: Card[] = [];
  public cpu: Card[] = [];
  public player: Card[] = [];
  public remaining: number = 0;
  public winner = '';
  public endGameMessage: string = '';

  constructor() {
    window.addEventListener('keyup', (event) => {
      if (event.key === 'Escape' && this.isShowModal === true) {
        this.closeModal()
      }
    })
  }

  // Llamamos al Endpoint que nos trae el mazo de cartas //
  getNewDeck() {
    fetch(this.newDeckUrl)
      .then(resp => resp.json())
      .then((data: Deck) => {
        // console.log(data)
        this.newDeck = data
        this.getHandCards()
      })
  }

  // Llamada al EndPoint que nos trae las cartas //
  getHandCards() {
    this.isLoading = true;
    const urlCards = this.newCardsUrl.replace('<<deck_id>>', this.newDeck.deck_id!)
    fetch(urlCards)
      .then(resp => resp.json())
      .then((data: CardsResponse) => {
        console.log('CARDS RESPONSE', data);
        this.remaining = data.remaining
        this.mapCards(data.cards);
        setTimeout(() => {
          this.isLoading = false;
        }, 500)
      })
  }


  // Mapeamos las Cartas que nos llegan por el endpoint para poder cambiar su propiedad value por un número //
  mapCards(cards: Card[]) {
    this.handCards = [...this.handCards, ...cards.map(card => {
      if (isNaN(Number(card.value)) === true) {
        card.value = this.transformValues(card.value.toString())
      }
      card.value = Number(card.value)
      return card
    })]
    console.log('HAND CARDS', this.handCards);
    this.setWinner();
  }

  // Transfomamos los valores que nos llegan de las Cards AS, JACK, QUEEN, KING //
  transformValues(cardValue: string): string {
    switch (cardValue) {
      case 'ACE':
        return '14'

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


  // Validamos quien es el ganador y metemos las cartas al ganador de la mano //
  setWinner() {
    const indexPlayer: number = this.handCards.length - 2;
    const indexCpu: number = this.handCards.length - 1;
    if (this.handCards[indexPlayer].value > this.handCards[indexCpu].value) {
      this.player = [...this.player, ...this.handCards]
      console.log('WINNER PLAYER');
      this.winner = 'player';
      this.isDraw = false;

    } else if (this.handCards[indexPlayer].value < this.handCards[indexCpu].value) {
      this.cpu = [...this.cpu, ...this.handCards]
      console.log('WINNER CPU');
      this.winner = 'cpu';
      this.isDraw = false;
    } else {
      console.log('EMPATE');
      this.isDraw = true;

    }
    console.log('PLAYER', this.player)
    console.log('CPU', this.cpu)
    if (this.remaining === 0) {
      this.endGame()
    }

  }

  // Botón para ejecutar la jugada siguiete //
  nextHand() {
    this.winner = '';
    if (!this.isDraw) {

      this.handCards = [];
    }
    this.getHandCards();
    console.log('-----------------------')

  }

  // Botón para inicial el juego desde cero //
  init() {
    this.endGameMessage = '';
    this.handCards = [];
    this.cpu = [];
    this.player = [];
    this.getNewDeck()
  }

  endGame() {
    switch (true) {
      case this.player.length > this.cpu.length:
        this.endGameMessage = `FELICIDADES PLAYER!!! GANASTE CON ${this.player.length} CARTAS`
        break;
      case this.player.length < this.cpu.length:
        this.endGameMessage = `OOOOOH PLAYER, PERDISTE!!! LA CPU SE HA QUEDADO CON ${this.cpu.length} CARTAS`
        break;
      default:
        this.endGameMessage = 'EMPATARON CARA CULOS'
        break;
    }
    this.openModal()
  }

  openModal() {
    this.isShowModal = true;
  }


  closeModal() {
    this.isShowModal = false;
    this.endGameMessage = '';
  }





}












