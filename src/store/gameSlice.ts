import { createSlice, PayloadAction, Draft } from "@reduxjs/toolkit";

import { Indexable } from "./util";
import { RootState } from "./store";
import { AdvisorType } from "./advisors";
import {
  hydrateAll,
  Card,
  Valuables,
  Resources,
  ValuableType,
  ResourceType,
  onAllResources,
  onAllValuables,
} from "./cards";

interface Deck extends Indexable<string[]> {
  library: string[];
  hand: string[];
  play: string[];
  new: string[];
  discard: string[];
}
interface GameState {
  valuables: Valuables;
  valuablesPerTurn: Valuables;
  upkeep: Valuables;
  resources: Resources;
  advisors: AdvisorType[];
  decks: { [id: string]: Deck };
  allCards: Indexable<Card>;
}

export const initialState: GameState = {
  valuables: {
    science: 20,
    industry: 200,
    gold: 1,
    food: 1,
    population: 1,
    defense: 1,
    culture: 1,
    happiness: 1,
  },
  valuablesPerTurn: {
    science: 1,
    industry: 1,
    gold: 1,
    food: 1,
    population: 1,
    defense: 0,
    culture: 1,
    happiness: 0,
  },
  upkeep: {
    science: 0,
    industry: 0,
    gold: 0,
    food: 0,
    population: 0,
    defense: 0,
    culture: 0,
    happiness: 0,
  },
  resources: {
    iron: false,
    oil: false,
    horses: false,
    coal: false,
    aluminum: false,
    melee: false,
    handguns: false,
    rifles: false,
    shotguns: false,
    sniperRifles: false,
  },
  advisors: ["domestic", "science", "foreign", "defense"],
  decks: {
    domestic: {
      library: [],
      hand: [],
      play: [],
      new: [],
      discard: [],
    },
    science: {
      library: ["alpha__science__agriculture"],
      hand: [],
      play: [],
      new: [],
      discard: [],
    },
    foreign: {
      library: [],
      hand: [],
      play: [],
      new: [],
      discard: [],
    },
    defense: {
      library: [],
      hand: [],
      play: [],
      new: [],
      discard: [],
    },
  },
  allCards: hydrateAll(),
};

const shuffle = (deck: string[]) => {
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  return deck;
};

const removeCard = (
  advisor: AdvisorType,
  cardId: string,
  state: Draft<GameState>,
  count = 1
) => {
  Object.entries(state.decks[advisor]).forEach(([key, val]) => {
    const deck = val.filter((c: string) => c != cardId);
    const addBackCount = val.length - deck.length - count;
    for (let i = 0; i < addBackCount; i++) {
      deck.push(cardId);
    }
    state.decks[advisor][key] = deck;
  });
};

const addCard = (
  advisor: AdvisorType,
  cardId: string,
  state: Draft<GameState>,
  count = 1
) => {
  const deck = state.decks[advisor];
  for (let i = 0; i < count; i++) {
    deck.new.push(cardId);
  }
};

export const canPlayCard = (
  card: Card,
  valuables: Valuables,
  resources: Resources
) => {
  let canPlay = true;

  // has valuables
  onAllValuables((key: string) => {
    if (
      valuables[key as ValuableType] >=
      (card.requirements.valuables
        ? card.requirements.valuables[key as ValuableType] || 0
        : 0)
    ) {
      canPlay = false;
    }
  });

  // has resources
  onAllResources((key: string) => {
    if (
      (card.requirements.resources
        ? card.requirements.resources[key as ResourceType] || false
        : false) &&
      !resources[key as ResourceType]
    ) {
      canPlay = false;
    }
  });

  return canPlay;
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setNewTurn: (state, {}: PayloadAction<void>) => {
      Object.entries(state.decks).map(([id, val]) => {
        // remove any cards that are not reusable
        val.play.forEach((c) => {
          const card = state.allCards[c];
          if (!card.reuse) {
            removeCard(card.advisor, card.id, state);
          }
        });
        // shuffle all used cards into discard
        const deck = [...val.hand, ...val.play, ...val.new, ...val.discard];
        state.decks[id].discard = deck;
        state.decks[id].hand = [];
        state.decks[id].play = [];
        state.decks[id].new = [];
      });

      // update global state of valuables
      onAllValuables((key: string) => {
        state.valuables[key as ValuableType] = Math.max(
          0,
          state.valuables[key as ValuableType] +
            state.valuablesPerTurn[key as ValuableType] -
            state.upkeep[key as ValuableType]
        );
      });
    },

    shuffleLibrary: (state, { payload: deckId }: PayloadAction<string>) => {
      state.decks[deckId].library = shuffle(state.decks[deckId].library);
    },

    drawCard: (state, { payload: deckId }: PayloadAction<string>) => {
      let card = state.decks[deckId].library.shift();
      if (!card) {
        state.decks[deckId].library = shuffle(state.decks[deckId].discard);
        state.decks[deckId].discard = [];
        card = state.decks[deckId].library.shift();
      }
      if (card) {
        state.decks[deckId].hand.push(card);
      }
    },

    playCard: (state, { payload: card }: PayloadAction<Card>) => {
      // move card from hand to to play
      const index = state.decks[card.advisor].hand.indexOf(card.id);
      if (index > -1) {
        let array = state.decks[card.advisor].hand;
        state.decks[card.advisor].hand = [
          ...array.slice(0, index),
          ...array.slice(index + 1),
        ];
      } else {
        throw new Error("Card was not in hand...");
      }
      state.decks[card.advisor].play.push(card.id);

      // pay requirements //

      // update valuables
      onAllValuables((key: string) => {
        state.valuables[key as ValuableType] = Math.max(
          0,
          state.valuables[key as ValuableType] -
            (card.requirements.valuables
              ? card.requirements.valuables[key as ValuableType] || 0
              : 0)
        );
      });

      // do play effects //

      // add cards
      if (card.play.addCard) {
        Object.entries(card.play.addCard).forEach(([advisor, v]) => {
          v?.forEach((cardId: string) => {
            addCard(advisor as AdvisorType, cardId, state);
          });
        });
      }

      // remove cards
      if (card.play.removeCard) {
        Object.entries(card.play.removeCard).forEach(([advisor, v]) => {
          v?.forEach((cardId: string) => {
            removeCard(advisor as AdvisorType, cardId, state);
          });
        });
      }

      // update valuablesPerTurn and upkeep
      onAllValuables((key: string) => {
        state.valuablesPerTurn[key as ValuableType] += card.play
          .addValuablesPerTurn
          ? card.play.addValuablesPerTurn[key as ValuableType] || 0
          : 0;

        state.upkeep[key as ValuableType] += card.play.upkeep
          ? card.play.upkeep[key as ValuableType] || 0
          : 0;
      });

      // update resources
      onAllResources((key: string) => {
        state.resources[key as ResourceType] ||= card.play.addResources
          ? card.play.addResources[key as ResourceType] || false
          : false;
      });
    },
  },
});

export const { drawCard, setNewTurn, playCard, shuffleLibrary } =
  gameSlice.actions;

export const selectAllCards = (state: RootState) => state.game.allCards;
export const selectValuables = (state: RootState) => state.game.valuables;
export const selectValuablesPerTurn = (state: RootState) =>
  state.game.valuablesPerTurn;
export const selectUpkeep = (state: RootState) => state.game.upkeep;
export const selectResources = (state: RootState) => state.game.resources;
export const selectAdvisors = (state: RootState) => state.game.advisors;
export const selectDecks = (state: RootState) => state.game.decks;

export const gameReducer = gameSlice.reducer;
