import React, { useEffect } from "react";
import { Button } from "antd";
import { useAppDispatch, useAppSelector } from "./store/hooks";

import { AdvisorHand } from "./Advisor";
import {
  selectAdvisors,
  selectDecks,
  setNewTurn,
  drawCard,
  shuffleLibrary,
} from "./store/gameSlice";

export const Board = () => {
  const dispatch = useAppDispatch();
  const advisors = useAppSelector(selectAdvisors) ?? [];
  const decks = useAppSelector(selectDecks) ?? {};

  useEffect(() => {
    // on intial load draw 1 card from each deck
    advisors.forEach((a) => {
      dispatch(shuffleLibrary(a));
      dispatch(drawCard(a));
    });
  }, []);

  return (
    <>
      {advisors.map((a) => (
        <React.Fragment key={a}>
          <AdvisorHand advisorKey={a} deck={decks[a].hand} />
          <Button onClick={() => dispatch(drawCard(a))}>Draw Card</Button>
        </React.Fragment>
      ))}
      <Button onClick={() => dispatch(setNewTurn())}>Next Turn</Button>
    </>
  );
};
