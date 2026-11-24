import "./TilesPage.css";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GripSlider } from "../components/GripSlider";
import { Pagination } from "../components/Pagination";
import { TireCard } from "../components/TireCard";
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

  const handleFilter = () => {
    // ползунок на нуле — фильтра нет
    dispatch(setGrip(sliderValue > 0 ? sliderValue.toFixed(2) : ""));
    setReloadTick((tick) => tick + 1);
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  return (
    <div className="container">
      <div className="tilesToolbar">
        <GripSlider
          value={sliderValue}
          setValue={setSliderValue}
          onSubmit={handleFilter}
          loading={loading}
        />
      </div>

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

      <div className="tilesPagination">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          disabled={loading}
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
