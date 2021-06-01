import * as React from "react";

export class GameData {
  researchPoints = 0;
  industryPoints = 0;
  researchPointsPerTurn = 20;
  industryPointsPerTurn = 200;
  scienceAdvisorToken = false;
  interiorAdvisorToken = false;

  leaderCards: { [id: string]: LeaderCard } = {
    science: {
      label: "See the Secretary of Science",
      costDesc: <span>FREE</span>,
      canPlay: () => true,
      play: () => {
        this.scienceAdvisorToken = true;
      },
    },
    interior: {
      label: "See the Secretary of the Interior",
      costDesc: <span>FREE</span>,
      canPlay: () => true,
      play: () => {
        this.interiorAdvisorToken = true;
      },
    },
  };

  scienceCards: { [id: string]: ScienceCard } = {
    marineBarracks: {
      label: "Research Marine Barracks",
      costDesc: <span>50 RP</span>,
      canPlay: () => this.researchPoints >= 50,
      play: () => {
        this.researchPoints -= 50;
        this.advisors.interior.deck.push(this.interiorCards.marineBarracks);
        this.advisors.science.deck.filter(
          (c) => c.label != this.scienceCards.marineBarracks.label
        );
      },
    },
  };

  interiorCards: { [id: string]: ScienceCard } = {
    marineBarracks: {
      label: "Build Marine Barracks",
      costDesc: <span>500 IP</span>,
      canPlay: () => this.industryPoints >= 500,
      play: () => {
        this.industryPoints -= 500;
      },
    },
  };

  advisors: { [id: string]: Advisor } = {
    leader: {
      label: "Leader",
      order: 0,
      deck: [this.leaderCards.science, this.leaderCards.interior],
    },
    science: {
      label: "Secretary of Science",
      order: 1,
      deck: [this.scienceCards.marineBarracks],
    },
    interior: {
      label: "Secretary of the Interior",
      order: 1,
      deck: [],
    },
  };
}

export interface Advisor {
  label: string;
  order: number;
  deck: Card[];
}

export interface Card {
  label: string;
  costDesc: JSX.Element;
  canPlay: () => boolean;
  play: () => void;
}

export interface LeaderCard extends Card {}

export interface ScienceCard extends Card {}
