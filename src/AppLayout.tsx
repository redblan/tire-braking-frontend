import { FC, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import { api } from "./api";
import { API_BASE_URL, IS_TAURI } from "./config";
import { TabBar } from "./components/TabBar";
import { ROUTES } from "./Routes";
import { useAppDispatch, useAppSelector } from "./store";
import { logoutSuccess } from "./store/authSlice";
import { clearDraft } from "./store/draftSlice";
import { fetchFeedItem } from "./store/feedSlice";
import { resetFilter } from "./store/tireConditionsSlice";
import "./MobileApp.css";

export const TOKEN_KEY = "access_token";

export const AppLayout: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  // идёт запрос к бэкенду — поверх страницы анимация, которая закрывает кнопки
  const loading = useAppSelector(
    (state) => state.tireConditions.loading || state.feed.loading || state.draft.loading,
  );

  // Лента сессии (100 случайных услуг в Redis) формируется при загрузке приложения:
  // первый запрос ленты создаёт её на бэкенде. Страница ленты делает этот запрос сама
  useEffect(() => {
    // (в нативном приложении ленты нет)
    if (!IS_TAURI && !location.pathname.startsWith(ROUTES.FEED)) {
      dispatch(fetchFeedItem({}));
    }
    // только при загрузке приложения
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Выход: только axios, состояние Redux меняется вручную; фильтр пользователя сбрасывается
  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/logout`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // токен мог уже истечь — из интерфейса пользователь выходит в любом случае
    }
    localStorage.removeItem(TOKEN_KEY);
    api.setSecurityData(null);
    dispatch(logoutSuccess());
    dispatch(resetFilter());
    dispatch(clearDraft());
    navigate(ROUTES.TILES);
  };

  return (
    <div className="appShell">
      {IS_TAURI && (
        <header className="nativeHeader">
          <div className="nativeBrand">
            <span className="nativeLogo" />
            <span className="nativeTitle">BrakePath</span>
            <span className="nativeSubtitle">Расчёт тормозного пути</span>
          </div>
          <div className="nativeServer" title="Адрес веб-сервиса в локальной сети">
            <span className="nativeServerDot" />
            {API_BASE_URL}
          </div>
        </header>
      )}
      <main className="appContent">
        <Outlet />
      </main>
      {loading && (
        <div className="appLoader">
          <Spinner animation="border" variant="light" />
        </div>
      )}
      {!IS_TAURI && <TabBar isAuthenticated={isAuthenticated} onLogout={handleLogout} />}
    </div>
  );
};
