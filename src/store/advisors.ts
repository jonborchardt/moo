import LeaderBack from "../icons/alienship2.png";
import ScienceBack from "../icons/tek-floor-blue.png";
import InteriorBack from "../icons/engineering.png";

export interface Advisor {
  label: string;
  order: number;
  back: string;
}

export const advisors = {
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

export type AdvisorKey = "leader" | "science" | "interior";

export type AdvisorCards = { [Property in AdvisorKey]: string[] };
