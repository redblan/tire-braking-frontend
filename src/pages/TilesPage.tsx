import "./TilesPage.css";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { GripSlider } from "../components/GripSlider";
import { Pagination } from "../components/Pagination";
import { TireCard } from "../components/TireCard";
import { SEARCH_THRESHOLD, SEARCH_TOP_K } from "../config";
import { useImageSearch } from "../hooks/useImageSearch";
import { ROUTES } from "../Routes";
import { useAppDispatch, useAppSelector } from "../store";
import {
  deleteTireCondition,
  fetchTireConditions,
  setCurrentPage,
  setGrip,
} from "../store/tireConditionsSlice";

export const TilesPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list, grip, currentPage, totalPages, total, loading, fromMock } = useAppSelector(
    (state) => state.tireConditions,
  );
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  // положение ползунка; в Redux фильтр попадает по кнопке «Применить фильтр»
  const [sliderValue, setSliderValue] = useState(Number(grip) || 0);

  // поиск похожих карточек по изображению — среди карточек текущей страницы
  const search = useImageSearch(list);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // выбранное изображение: показывается рядом с результатами
  const [preview, setPreview] = useState<{ url: string; name: string } | null>(null);

  // кнопка «Применить фильтр» перезагружает страницу, даже если значение фильтра не изменилось
  const [reloadTick, setReloadTick] = useState(0);

  // страница загружается заново при смене фильтра, номера страницы, по кнопке фильтра
  // и при входе или выходе (меняется is_owner)
  useEffect(() => {
    dispatch(fetchTireConditions());
  }, [dispatch, grip, currentPage, isAuthenticated, reloadTick]);

  // фильтр в Redux изменился не ползунком (сброс при выходе) — ползунок повторяет его
  const [shownGrip, setShownGrip] = useState(grip);
  if (grip !== shownGrip) {
    setShownGrip(grip);
    setSliderValue(Number(grip) || 0);
  }

  // сброс поиска по изображению: обычный список страницы и пустое поле выбора файла
  const handleResetSearch = () => {
    search.resetSearch();
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFilter = () => {
    handleResetSearch();
    // ползунок на нуле — фильтра нет
    dispatch(setGrip(sliderValue > 0 ? sliderValue.toFixed(2) : ""));
    setReloadTick((tick) => tick + 1);
  };

  const handlePageChange = (page: number) => {
    handleResetSearch();
    dispatch(setCurrentPage(page));
  };

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview({ url: URL.createObjectURL(file), name: file.name });
    search.searchByImage(file);
  };

  const searching = search.status === "working";

  return (
    <div className="container">
      <div className="tilesToolbar">
        <GripSlider
          value={sliderValue}
          setValue={setSliderValue}
          onSubmit={handleFilter}
          loading={loading}
        />

        <div className="imageSearch">
          <input
            ref={fileInputRef}
            className="imageSearchInput"
            type="file"
            accept="image/*"
            onChange={handleImage}
          />
          <Button
            variant="outline-secondary"
            disabled={searching || loading || !list.length}
            onClick={() => fileInputRef.current?.click()}
          >
            Поиск по изображению
          </Button>
          {search.status !== "idle" && (
            <Button variant="link" disabled={searching} onClick={handleResetSearch}>
              Сброс
            </Button>
          )}
        </div>
      </div>

      {preview && (
        <div className="searchSummary">
          <img className="searchPreview" src={preview.url} alt={preview.name} />
          <div className="searchSummaryText">
            <b>{preview.name}</b>
            {searching && (
              <span>
                Считаю эмбеддинги…
                {search.progress > 0 && search.progress < 100 && ` загрузка модели ${search.progress}%`}
              </span>
            )}
            {search.status === "error" && (
              <span className="imageSearchError">Не удалось выполнить поиск: {search.error}</span>
            )}
            {search.results && (
              <span>
                Похожих карточек на этой странице: {search.results.length} · порог {SEARCH_THRESHOLD} ·
                TopK {SEARCH_TOP_K}
              </span>
            )}
          </div>
        </div>
      )}

      {search.results ? (
        !search.results.length ? (
          <div className="tilesEmpty">
            <h1>К сожалению, пока ничего не найдено :(</h1>
          </div>
        ) : (
          <div className="cardsList">
            {search.results.map(({ item, score, similarity }) => (
              <TireCard
                key={item.id}
                onClick={() => navigate(`${ROUTES.DETAIL}/${item.id}`)}
                footer={
                  <div className="cardScore">
                    <div className="cardScoreBar">
                      <div className="cardScoreFill" style={{ width: `${Math.round(score * 100)}%` }} />
                    </div>
                    <span className="cardScoreText">
                      близость {score.toFixed(2)} · cos {similarity.toFixed(3)}
                    </span>
                    <span className="cardScoreDescription">{item.description_en}</span>
                  </div>
                }
                {...item}
              />
            ))}
          </div>
        )
      ) : (
        <>
          <div className="tilesInfo">
            Найдено услуг: {total.toLocaleString("ru-RU")}
            {fromMock && " (mock, бэкенд недоступен)"}
          </div>

          {!list.length && !loading ? (
            <div className="tilesEmpty">
              <h1>К сожалению, пока ничего не найдено :(</h1>
            </div>
          ) : (
            <div className="cardsList">
              {list.map((item) => (
                <TireCard
                  key={item.id}
                  onClick={() => navigate(`${ROUTES.DETAIL}/${item.id}`)}
                  onDelete={
                    item.is_owner === 1 ? () => dispatch(deleteTireCondition(item.id)) : undefined
                  }
                  {...item}
                />
              ))}
            </div>
          )}
        </>
      )}

      <div className="tilesPagination">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          disabled={loading || searching}
        />
        {totalPages > 1 && (
          <span className="tilesInfo">
            стр. {currentPage} из {totalPages.toLocaleString("ru-RU")}
          </span>
        )}
      </div>
    </div>
  );
};
