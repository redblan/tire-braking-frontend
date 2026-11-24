import "./TabBar.css";
import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES, ROUTE_LABELS } from "../Routes";

interface Props {
  isAuthenticated: boolean;
  onLogout: () => void;
}

// Нижняя панель: лента, добавление, плитка и Вход (после авторизации — Выход)
export const TabBar: FC<Props> = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isFeed = location.pathname.startsWith(ROUTES.FEED);
  const isAdd = location.pathname.startsWith(ROUTES.ADD);
  const isLogin = location.pathname.startsWith(ROUTES.LOGIN);
  const isTiles =
    location.pathname === ROUTES.TILES ||
    location.pathname.startsWith(ROUTES.DETAIL);

  const itemClass = (active: boolean) =>
    `tabBarItem ${active ? "tabBarItemActive" : ""}`;

  return (
    <nav className="tabBar">
      <button type="button" className={itemClass(isFeed)} onClick={() => navigate(ROUTES.FEED)}>
        <span className="tabBarIcon">▶</span>
        {ROUTE_LABELS.FEED}
      </button>
      <button type="button" className={itemClass(isAdd)} onClick={() => navigate(ROUTES.ADD)}>
        <span className="tabBarIcon">+</span>
        {ROUTE_LABELS.ADD}
      </button>
      <button type="button" className={itemClass(isTiles)} onClick={() => navigate(ROUTES.TILES)}>
        <span className="tabBarIcon">▦</span>
        {ROUTE_LABELS.TILES}
      </button>
      {isAuthenticated ? (
        <button type="button" className="tabBarItem" onClick={onLogout}>
          <span className="tabBarIcon">←</span>
          Выход
        </button>
      ) : (
        <button type="button" className={itemClass(isLogin)} onClick={() => navigate(ROUTES.LOGIN)}>
          <span className="tabBarIcon">→</span>
          {ROUTE_LABELS.LOGIN}
        </button>
      )}
    </nav>
  );
};
