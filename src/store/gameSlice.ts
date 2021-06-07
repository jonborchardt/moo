import { createSlice, PayloadAction, Draft } from "@reduxjs/toolkit";

import type { RootState } from "./store";
import { AdvisorKey, AdvisorCards } from "./advisors";
import { Card } from "./cards";

interface GameState {
  test: string;
  researchPoints: number;
  industryPoints: number;
  researchPointsPerTurn: number;
  industryPointsPerTurn: number;
  advisors: AdvisorKey[];
  decks: AdvisorCards;
}

export const initialState: GameState = {
  test: "test",
  researchPoints: 0,
  industryPoints: 0,
  researchPointsPerTurn: 20,
  industryPointsPerTurn: 200,
  advisors: ["leader", "science", "interior"],
  decks: {
    leader: [
      "l1_science",
      "l1_science",
      "l1_science",
      "l1_interior",
      "l1_interior",
    ],
    science: [
      "s1_pureResearch",
      "s1_pureResearch",
      "s1_pureResearch",
      "s1_pureResearch",
      "s1_marineBarracks",
    ],
    interior: [],
  },
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setTest: (state, { payload }: PayloadAction<string>) => {
      state.test = payload;
    },

    setNewTurn: (state, {}: PayloadAction<void>) => {
      state.researchPoints += state.researchPointsPerTurn;
      state.industryPoints + state.industryPointsPerTurn;
    },

    /*addCard: (state, { payload: card }: PayloadAction<Card>) => {
      state.decks[card.advisor].push(card.id);
    },

    removeCard: (state, { payload: card }: PayloadAction<Card>) => {
      const idx = state.decks[card.advisor].findIndex(
        (c: string) => c === card.id
      );
      state.decks[card.advisor].splice(idx, 1);
    },*/

    playCard: (state, { payload }: PayloadAction<Card>) => {
      // pay requirements //

      // update industryPoints
      if (payload.requirements.industryPoints) {
        state.industryPoints += payload.requirements.industryPoints;
      }

      // update researchPoints
      if (payload.requirements.researchPoints) {
        state.researchPoints -= payload.requirements.researchPoints;
      }

      // do play effects //

      // add cards
      if (payload.play.addCard) {
        Object.entries(payload.play.addCard).forEach(([advisor, v]) => {
          v?.forEach((cardId: string) => {
            addCard(advisor as AdvisorKey, cardId, state);
          });
        });
      }

      // remove cards
      if (payload.play.removeCard) {
        Object.entries(payload.play.removeCard).forEach(([advisor, v]) => {
          v?.forEach((cardId: string) => {
            removeCard(advisor as AdvisorKey, cardId, state);
          });
        });
      }

      // remove all cards
      if (payload.play.removeCardAll) {
        Object.entries(payload.play.removeCardAll).forEach(([advisor, v]) => {
          v?.forEach((cardId: string) => {
            removeCard(advisor as AdvisorKey, cardId, state, 9999);
          });
        });
      }

      // update researchPointsPerTurn
      if (payload.play.addResearchPointsPerTurn) {
        state.researchPointsPerTurn += payload.play.addResearchPointsPerTurn;
      }

      // update industryPointsPerTurn
      if (payload.play.addIndustryPointsPerTurn) {
        state.industryPointsPerTurn += payload.play.addIndustryPointsPerTurn;
      }
    },
  },
});

export const { setTest, setNewTurn, playCard } = gameSlice.actions;

export const selectTest = (state: RootState) => state.game.test;
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

function removeCard(
  advisor: AdvisorKey,
  cardId: string,
  state: Draft<GameState>,
  count = 1
) {
  const originalDeck = state.decks[advisor];
  const deck = originalDeck.filter((c: string) => c != cardId);
  const addBackCount = originalDeck.length - deck.length - count;
  for (let i = 0; i < addBackCount; i++) {
    deck.push(cardId);
  }
  state.decks[advisor] = deck;
}

function addCard(
  advisor: AdvisorKey,
  cardId: string,
  state: Draft<GameState>,
  count = 1
) {
  const deck = state.decks[advisor];
  for (let i = 0; i < count; i++) {
    deck.push(cardId);
  }
  state.decks[advisor] = deck;
}
