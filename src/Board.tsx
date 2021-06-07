import * as React from "react";
import { Button } from "antd";
import { useAppDispatch, useAppSelector } from "./store/hooks";

import { AdvisorHand } from "./Advisor";
import { selectAdvisors, selectDecks, setNewTurn } from "./store/gameSlice";

export const Board = () => {
  const dispatch = useAppDispatch();
  const advisors = useAppSelector(selectAdvisors) ?? [];
  const decks = useAppSelector(selectDecks) ?? {};

  return (
    <>
      {advisors.map((a) => (
        <AdvisorHand advisorKey={a} deck={decks[a]} />
      ))}
      <Button onClick={() => dispatch(setNewTurn())}>Next Turn</Button>
    </>
  );
};
