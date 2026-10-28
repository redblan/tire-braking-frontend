import { FC, useState } from "react";
import { Outlet } from "react-router-dom";
import { TireCondition } from "./modules/tireApi";
import { TIRE_CONDITIONS_MOCK } from "./modules/mock";
import { TabBar } from "./components/TabBar";
import "./MobileApp.css";

export interface AppOutletContext {
  cards: TireCondition[];
  setCards: (cards: TireCondition[]) => void;
}

export const AppLayout: FC = () => {
  const [cards, setCards] = useState<TireCondition[]>(TIRE_CONDITIONS_MOCK.results);

  return (
    <div className="appShell">
      <main className="appContent">
        <Outlet context={{ cards, setCards }} />
      </main>
      <TabBar cards={cards} />
    </div>
  );
};
