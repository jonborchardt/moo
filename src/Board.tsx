import * as React from "react";
import { Button } from "antd";

import { Card, ScienceCard, InteriorCard, LeaderCard } from "./Card";
import { Advisor, AdvisorButton, AdvisorHand } from "./Advisor";

import LeaderTypeSrc from "./icons/GameToken_27_1.png";
import InteriorTypeSrc from "./icons/GameToken_31_1.png";
import ScienceTypeSrc from "./icons/GameToken_34_1.png";
import ScienceSrc from "./icons/g_02.png";
import InteriorSrc from "./icons/gr_05.png";
import MarineBarracksSrc from "./icons/SGI_76.png";

import LeaderBack from "./icons/alienship2.png";
import ScienceBack from "./icons/tek-floor-blue.png";
import InteriorBack from "./icons/engineering.png";

export const Board = () => {
  const [researchPoints, setResearchPoints] = React.useState(0);
  const [industryPoints, setIndustryPoints] = React.useState(0);
  const [researchPointsPerTurn, setResearchPointsPerTurn] = React.useState(20);
  const [industryPointsPerTurn, setIndustryPointsPerTurn] = React.useState(200);

  const [leaderDeck, setLeaderDeck] = React.useState<LeaderCard[]>([]);
  const [scienceDeck, setScienceDeck] = React.useState<ScienceCard[]>([]);
  const [interiorDeck, setInteriorDeck] = React.useState<InteriorCard[]>([]);

  const advisors: { [id: string]: Advisor } = {
    leader: {
      label: "Leader",
      order: 0,
      back: LeaderBack,
    },
    science: {
      label: "Secretary of Science",
      order: 1,
      back: ScienceBack,
    },
    interior: {
      label: "Secretary of the Interior",
      order: 2,
      back: InteriorBack,
    },
  };

  const init = () => {
    // initial leader cards
    addCard(leaderDeck, setLeaderDeck, leaderCards.science, 3);
    addCard(leaderDeck, setLeaderDeck, leaderCards.interior, 2);

    // initial science cards
    addCard(scienceDeck, setScienceDeck, scienceCards.marineBarracks, 1);
    addCard(scienceDeck, setScienceDeck, scienceCards.pureResearch, 4);
  };

  React.useEffect(() => {
    init();
  }, []);

  const setNewTurn = () => {
    setResearchPoints(researchPoints + researchPointsPerTurn);
    setIndustryPoints(industryPoints + industryPointsPerTurn);
  };

  const leaderCards: { [id: string]: LeaderCard } = {
    science: {
      id: "science",
      label: "Science",
      description: "See the Secretary of Science",
      costDesc: <span>FREE</span>,
      imageSrc: ScienceSrc,
      typeSrc: LeaderTypeSrc,
      canPlay: () => true,
      play: () => {},
    },
    interior: {
      id: "interior",
      label: "Interior",
      description: "See the Secretary of the Interior",
      costDesc: <span>FREE</span>,
      imageSrc: InteriorSrc,
      typeSrc: LeaderTypeSrc,
      canPlay: () => true,
      play: () => {},
    },
  };

  const scienceCards: { [id: string]: ScienceCard } = {
    pureResearch: {
      id: "pureResearch",
      label: "Pure Research",
      description: "Advance Research points",
      costDesc: <span>10 RP</span>,
      imageSrc: MarineBarracksSrc,
      typeSrc: ScienceTypeSrc,
      canPlay: () => researchPoints >= 10,
      play: () => {
        setResearchPoints(researchPoints - 10);
        setResearchPointsPerTurn(researchPointsPerTurn + 10);
      },
    },
    marineBarracks: {
      id: "marineBarracks",
      label: "Marine Barracks",
      description: "Research Marine Barracks",
      costDesc: <span>50 RP</span>,
      imageSrc: MarineBarracksSrc,
      typeSrc: ScienceTypeSrc,
      canPlay: () => researchPoints >= 50,
      play: () => {
        setResearchPoints(researchPoints - 50);
        addCard(interiorDeck, setInteriorDeck, interiorCards.marineBarracks);
        removeCard(
          scienceDeck,
          setScienceDeck,
          scienceCards.marineBarracks,
          999
        );
      },
    },
  };

  const interiorCards: { [id: string]: ScienceCard } = {
    marineBarracks: {
      id: "marineBarracks",
      label: "Marine Barracks",
      description: "Build Marine Barracks",
      costDesc: <span>500 IP</span>,
      imageSrc: MarineBarracksSrc,
      typeSrc: InteriorTypeSrc,
      canPlay: () => industryPoints >= 500,
      play: () => {
        setIndustryPoints(industryPoints - 500);
      },
    },
  };

  function removeCard<T extends Card>(
    originalDeck: T[],
    setDeck: React.Dispatch<React.SetStateAction<T[]>>,
    card: T,
    count = 1
  ) {
    const deck = originalDeck.filter((c) => c.id != card.id);
    const addBackCount = originalDeck.length - deck.length - count;
    for (let i = 0; i < addBackCount; i++) {
      deck.push(card);
    }
    setDeck(deck);
  }

  function addCard<T extends Card>(
    originalDeck: T[],
    setDeck: React.Dispatch<React.SetStateAction<T[]>>,
    card: T,
    count = 1
  ) {
    const deck = originalDeck;
    for (let i = 0; i < count; i++) {
      deck.push(card);
    }
    setDeck(deck);
  }

  return (
    <>
      <AdvisorHand advisor={advisors.leader} deck={leaderDeck} />
      <AdvisorHand advisor={advisors.science} deck={scienceDeck} />
      <AdvisorHand advisor={advisors.interior} deck={interiorDeck} />
      <Button onClick={() => setNewTurn()}>Next Turn</Button>
    </>
  );
};
