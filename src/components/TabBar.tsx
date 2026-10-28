import "./TabBar.css";
import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import { TireCondition } from "../modules/tireApi";

interface Props {
  cards: TireCondition[];
}

export const TabBar: FC<Props> = ({ cards }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isFeed = location.pathname.startsWith(ROUTES.FEED);
  const isTiles =
    location.pathname === ROUTES.TILES ||
    location.pathname.startsWith(ROUTES.DETAIL);

  const goToTiles = () => navigate(ROUTES.TILES);

  const goToFeed = () => {
    const firstId = cards[0]?.id;
    if (firstId) {
      navigate(`${ROUTES.FEED}/${firstId}`);
    }
  };

  return (
    <nav className="tabBar">
      <button
        type="button"
        className={`tabBarItem ${isFeed ? "tabBarItemActive" : ""}`}
        onClick={goToFeed}
      >
        <span className="tabBarIcon">▶</span>
        {ROUTE_LABELS.FEED}
      </button>
      <button type="button" className="tabBarItem tabBarItemDisabled" disabled>
        <span className="tabBarIcon">+</span>
        {ROUTE_LABELS.ADD}
      </button>
      <button
        type="button"
        className={`tabBarItem ${isTiles ? "tabBarItemActive" : ""}`}
        onClick={goToTiles}
      >
        <span className="tabBarIcon">▦</span>
        {ROUTE_LABELS.TILES}
      </button>
      <button type="button" className="tabBarItem tabBarItemDisabled" disabled>
        <span className="tabBarIcon">→</span>
        {ROUTE_LABELS.LOGIN}
      </button>
    </nav>
  );
};
