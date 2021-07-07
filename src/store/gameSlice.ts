import { createSlice, PayloadAction, Draft } from "@reduxjs/toolkit";

import { Indexable } from "./util";
import { RootState, store } from "./store";
import { AdvisorKey, AdvisorCards } from "./advisors";
import { Card } from "./cards";

interface Deck extends Indexable<string[]> {
  library: string[];
  hand: string[];
  play: string[];
  discard: string[];
}
interface GameState {
  researchPoints: number;
  industryPoints: number;
  researchPointsPerTurn: number;
  industryPointsPerTurn: number;
  advisors: AdvisorKey[];
  decks: { [id: string]: Deck };
}

export const initialState: GameState = {
  researchPoints: 0,
  industryPoints: 0,
  researchPointsPerTurn: 20,
  industryPointsPerTurn: 200,
  advisors: ["leader", "science", "interior"],
  decks: {
    leader: {
      library: [
        "l1_science",
        "l1_science",
        "l1_science",
        "l1_interior",
        "l1_interior",
      ],
      hand: [],
      play: [],
      discard: [],
    },
    science: {
      library: [
        "s1_pureResearch",
        "s1_pureResearch",
        "s1_pureResearch",
        "s1_pureResearch",
        "s1_marineBarracks",
      ],
      hand: [],
      play: [],
      discard: [],
    },
    interior: {
      library: [],
      hand: [],
      play: [],
      discard: [],
    },
  },
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
  advisor: AdvisorKey,
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
  advisor: AdvisorKey,
  cardId: string,
  state: Draft<GameState>,
  count = 1
) => {
  const deck = state.decks[advisor];
  for (let i = 0; i < count; i++) {
    deck.play.push(cardId);
  }
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setNewTurn: (state, {}: PayloadAction<void>) => {
      Object.entries(state.decks).map(([id, val]) => {
        const deck = [...val.hand, ...val.play, ...val.discard];
        state.decks[id].discard = deck;
        state.decks[id].hand = [];
        state.decks[id].play = [];
      });

      state.researchPoints += state.researchPointsPerTurn;
      state.industryPoints + state.industryPointsPerTurn;
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

      // update industryPoints
      if (card.requirements.industryPoints) {
        state.industryPoints += card.requirements.industryPoints;
      }

      // update researchPoints
      if (card.requirements.researchPoints) {
        state.researchPoints -= card.requirements.researchPoints;
      }

      // do play effects //

      // add cards
      if (card.play.addCard) {
        Object.entries(card.play.addCard).forEach(([advisor, v]) => {
          v?.forEach((cardId: string) => {
            addCard(advisor as AdvisorKey, cardId, state);
          });
        });
      }

      // remove cards
      if (card.play.removeCard) {
        Object.entries(card.play.removeCard).forEach(([advisor, v]) => {
          v?.forEach((cardId: string) => {
            removeCard(advisor as AdvisorKey, cardId, state);
          });
        });
      }

      // remove all cards
      if (card.play.removeCardAll) {
        Object.entries(card.play.removeCardAll).forEach(([advisor, v]) => {
          v?.forEach((cardId: string) => {
            removeCard(advisor as AdvisorKey, cardId, state, 9999);
          });
        });
      }

      // update researchPointsPerTurn
      if (card.play.addResearchPointsPerTurn) {
        state.researchPointsPerTurn += card.play.addResearchPointsPerTurn;
      }

      // update industryPointsPerTurn
      if (card.play.addIndustryPointsPerTurn) {
        state.industryPointsPerTurn += card.play.addIndustryPointsPerTurn;
      }
    },
  },
});

export const { drawCard, setNewTurn, playCard, shuffleLibrary } =
  gameSlice.actions;

export const selectResearchPoints = (state: RootState) =>
  state.game.researchPoints;
export const selectIndustryPoints = (state: RootState) =>
  state.game.industryPoints;
export const selectResearchPointsPerTurn = (state: RootState) =>
  state.game.researchPointsPerTurn;
export const selectIndustryPointsPerTurn = (state: RootState) =>
  state.game.industryPointsPerTurn;
export const selectAdvisors = (state: RootState) => state.game.advisors;
export const selectDecks = (state: RootState) => state.game.decks;

export const gameReducer = gameSlice.reducer;
