import "./FeedPage.css";
import { FC, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { ModelViewer } from "../components/ModelViewer";
import { DEFAULT_MODEL, POLL_INTERVAL, mediaUrl } from "../config";
import { ROUTES } from "../Routes";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchFeedItem, likeTireCondition, pollFeedItem } from "../store/feedSlice";

export const FeedPage: FC = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next") === "true";
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { item, loading, notFound, fromMock, pollTick } = useAppSelector((state) => state.feed);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // /feed — первая услуга ленты, /feed/5 — услуга 5, /feed/5?next=true — следующая после 5
  // (с next=true бэкенд запускает асинхронный сервис: через 5–10 секунд углы модели изменятся)
  useEffect(() => {
    dispatch(fetchFeedItem({ id: id ? Number(id) : undefined, next }));
  }, [dispatch, id, next, isAuthenticated]);

  // Short Polling: раз в POLL_INTERVAL вызывается метод ленты по id услуги на экране;
  // ответ меняет состояние (pollTick), эффект срабатывает снова и планирует следующий запрос
  useEffect(() => {
    if (!item || fromMock) return;
    const timer = setTimeout(() => dispatch(pollFeedItem(item.id)), POLL_INTERVAL);
    return () => clearTimeout(timer);
  }, [dispatch, item, fromMock, pollTick]);

  if (notFound && !loading) {
    return <div className="feedLoader">Услуга не найдена</div>;
  }
  if (!item) {
    return <div className="feedLoader" />;
  }

  const handleNext = () => {
    navigate(`${ROUTES.FEED}/${item.id}?next=true`);
  };

  const handleLike = () => {
    dispatch(likeTireCondition({ id: item.id, value: item.is_liked ? 0 : 1 }));
  };

  return (
    <div className="feedPage">
      <div className="feedModel">
        <ModelViewer
          modelUrl={mediaUrl(item.model_url, DEFAULT_MODEL)}
          angleX={item.angle_x}
          angleY={item.angle_y}
        />
      </div>
      <div className="feedAngles">
        {item.position > 0 && <span>№ {item.position} из 100</span>}
        <span>
          X {item.angle_x.toFixed(2)}° · Y {item.angle_y.toFixed(2)}°
        </span>
      </div>
      <div className="feedOverlay">
        <div className="feedTitle">{item.name}</div>
        <div className="feedDescription">{item.description}</div>
        <div className="feedTags">
          <span className="feedTag">шина {item.mu_tire.toFixed(2)}</span>
          <span className="feedTag">покрытие {item.mu_surface.toFixed(2)}</span>
        </div>
        <div className="feedButtons">
          {isAuthenticated && (
            <Button
              variant={item.is_liked ? "danger" : "outline-light"}
              disabled={loading}
              onClick={handleLike}
            >
              ♥
            </Button>
          )}
          <Button className="feedNextBtn" variant="light" disabled={loading} onClick={handleNext}>
            Далее
          </Button>
        </div>
      </div>
    </div>
  );
};
