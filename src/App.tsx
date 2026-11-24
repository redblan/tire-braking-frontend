import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TilesPage } from "./pages/TilesPage";
import { FeedPage } from "./pages/FeedPage";
import { DetailPage } from "./pages/DetailPage";
import { AddPage } from "./pages/AddPage";
import { LoginPage } from "./pages/LoginPage";
import { IS_TAURI } from "./config";
import { ROUTES } from "./Routes";
import { AppLayout } from "./AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.TILES} element={<TilesPage />} />
          <Route path={`${ROUTES.DETAIL}/:id`} element={<DetailPage />} />
          {/* нативное приложение — интерфейс гостя из двух страниц: список услуг и «Подробнее» */}
          {!IS_TAURI && (
            <>
              <Route path={ROUTES.FEED} element={<FeedPage />} />
              <Route path={`${ROUTES.FEED}/:id`} element={<FeedPage />} />
              <Route path={ROUTES.ADD} element={<AddPage />} />
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
