import { Indexable } from "./util";

import ForeignBack from "../icons/alienship2.png";
import ScienceBack from "../icons/tek-floor-blue.png";
import DomesticBack from "../icons/engineering.png";
import DefenseBack from "../icons/engineering.png"; // todo
import ForeignTypeSrc from "../icons/GameToken_27_1.png";
import ScienceTypeSrc from "../icons/GameToken_34_1.png";
import DomesticTypeSrc from "../icons/GameToken_31_1.png";
import DefenseTypeSrc from "../icons/GameToken_31_1.png"; // todo

export interface Advisor {
  label: string;
  order: number;
  back: string;
  icon: string;
}

export const advisors: Indexable<Advisor> = {
  domestic: {
    label: "Domestic Advisor",
    order: 0,
    back: DomesticBack,
    icon: DomesticTypeSrc,
  },
  science: {
    label: "Science Advisor",
    order: 1,
    back: ScienceBack,
    icon: ScienceTypeSrc,
  },
  foreign: {
    label: "Foreign Advisor",
    order: 2,
    back: ForeignBack,
    icon: ForeignTypeSrc,
  },
  defense: {
    label: "Defense Advisor",
    order: 3,
    back: DefenseBack,
    icon: DefenseTypeSrc,
  },
};

export type AdvisorType = "domestic" | "science" | "foreign" | "defense";

export type AdvisorCards = { [Property in AdvisorType]: string[] };
