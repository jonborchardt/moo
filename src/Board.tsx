import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";

import { selectAdvisors, drawCard, shuffleLibrary } from "./store/gameSlice";
import { PlaySpace } from "./PlaySpace";

export const Board = () => {
  const dispatch = useAppDispatch();
  const advisors = useAppSelector(selectAdvisors) ?? [];

  useEffect(() => {
    // on intial load draw 1 card from each deck
    advisors.forEach((a) => {
      dispatch(shuffleLibrary(a));
      dispatch(drawCard(a));
    });
  }, []);

  return <PlaySpace />;
};
