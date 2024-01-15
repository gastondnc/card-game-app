export type Deck = {
  success:   boolean;
  deck_id:   string;
  remaining: number;
  shuffled: boolean;
}

export type CardsResponse = {
  success:   boolean;
  deck_id:   string;
  cards:     Card[];
  remaining: number;
}

export type Card = {
  code:   string;
  image:  string;
  images: Images;
  value:  string | number;
  suit:   Suit;
}

export type Images = {
  svg: string;
  png: string;
}

export enum Suit {
  Clubs = "CLUBS",
  Diamonds = "DIAMONDS",
  Hearts = "HEARTS",
  Spades = "SPADES",
}

export enum ResultHand {
  PLAYER = 'player',
  CPU = 'cpu',
  TIE = 'tie'
}
