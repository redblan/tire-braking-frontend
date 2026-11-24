import "./DetailPage.css";
import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { DEFAULT_IMAGE, IS_TAURI, mediaUrl } from "../config";
import { ROUTES } from "../Routes";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchFeedItem } from "../store/feedSlice";

export const DetailPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // услуга уже загружена на странице плитки — берётся из Redux без запроса
  const fromList = useAppSelector((state) =>
    state.tireConditions.list.find((item) => String(item.id) === id),
  );
  const feed = useAppSelector((state) => state.feed);

  // услуги нет в плитке (страницу открыли по прямой ссылке) — одна услуга по id методом ленты, без next
  useEffect(() => {
    if (id && !fromList) dispatch(fetchFeedItem({ id: Number(id) }));
  }, [dispatch, id, fromList]);

  const item = fromList ?? (feed.item && String(feed.item.id) === id ? feed.item : null);

  if (!item) {
    return (
      <div className="detailLoader">{feed.notFound && !feed.loading && "Услуга не найдена"}</div>
    );
  }

  return (
    <div className="detailPage">
      <img
        className="detailImage"
        src={mediaUrl(item.image_url, DEFAULT_IMAGE)}
        alt={item.name}
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = DEFAULT_IMAGE;
        }}
      />
      <div className="detailBody">
        {IS_TAURI && (
          <button type="button" className="detailBack" onClick={() => navigate(ROUTES.TILES)}>
            ‹ Список услуг
          </button>
        )}
        <h1 className="detailTitle">{item.name}</h1>
        <p className="detailDescription">{item.description}</p>
        <p className="detailDescriptionEn">{item.description_en}</p>
        <div className="detailField">
          <span>Сцепление шины (mu_tire)</span>
          <b>{item.mu_tire.toFixed(2)}</b>
        </div>
        <div className="detailField">
          <span>Сцепление покрытия (mu_surface)</span>
          <b>{item.mu_surface.toFixed(2)}</b>
        </div>
        {!IS_TAURI && (
          <Button onClick={() => navigate(`${ROUTES.FEED}/${item.id}`)}>Открыть в ленте</Button>
        )}
      </div>
    </div>
  );
};
