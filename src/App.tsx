import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TilesPage } from "./pages/TilesPage";
import { FeedPage } from "./pages/FeedPage";
import { DetailPage } from "./pages/DetailPage";
import { ROUTES } from "./Routes";
import { AppLayout } from "./AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.TILES} element={<TilesPage />} />
          <Route path={`${ROUTES.FEED}/:id`} element={<FeedPage />} />
          <Route path={`${ROUTES.DETAIL}/:id`} element={<DetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
