import "./FeedPage.css";
import { FC, useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import { TireCondition } from "../modules/tireApi";
import { TIRE_CONDITIONS_MOCK } from "../modules/mock";
import { ROUTES } from "../Routes";
import { AppOutletContext } from "../AppLayout";

const defaultImage = "/DefaultImage.jpg";
const defaultVideo = "/DefaultVideo.webm";

export const FeedPage: FC = () => {
  const [pageData, setPageData] = useState<TireCondition>();
  const { id } = useParams();
  const navigate = useNavigate();
  const { cards } = useOutletContext<AppOutletContext>();

  useEffect(() => {
    if (!id) return;

    const fromList = cards.find((item) => String(item.id) === id);
    setPageData(
      fromList ??
        TIRE_CONDITIONS_MOCK.results.find((item) => String(item.id) === id)
    );
  }, [id, cards]);

  const handleNext = () => {
    if (!id || !cards.length) return;
    const currentIndex = cards.findIndex((item) => String(item.id) === id);
    const nextItem = cards[currentIndex + 1];
    if (nextItem) {
      navigate(`${ROUTES.FEED}/${nextItem.id}`);
    }
  };

  if (!pageData) {
    return (
      <div className="feedLoader">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="feedPage">
      <video
        key={pageData.id}
        className="feedVideo"
        src={pageData.video_url || defaultVideo}
        poster={pageData.image_url || defaultImage}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="feedOverlay">
        <div className="feedTitle">{pageData.name}</div>
        <div className="feedDescription">{pageData.description}</div>
        <div className="feedTags">
          <span className="feedTag">шина {pageData.mu_tire.toFixed(2)}</span>
          <span className="feedTag">
            покрытие {pageData.mu_surface.toFixed(2)}
          </span>
        </div>
        <Button className="feedNextBtn" variant="light" onClick={handleNext}>
          Далее
        </Button>
      </div>
    </div>
  );
};
