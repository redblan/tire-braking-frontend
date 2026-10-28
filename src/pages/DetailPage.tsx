import "./DetailPage.css";
import { FC, useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import { TireCondition } from "../modules/tireApi";
import { TIRE_CONDITIONS_MOCK } from "../modules/mock";
import { ROUTES } from "../Routes";
import { AppOutletContext } from "../AppLayout";

const defaultImage = "/DefaultImage.jpg";

export const DetailPage: FC = () => {
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

  if (!pageData) {
    return (
      <div className="detailLoader">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="detailPage">
      <img
        className="detailImage"
        src={pageData.image_url || defaultImage}
        alt={pageData.name}
      />
      <div className="detailBody">
        <h1 className="detailTitle">{pageData.name}</h1>
        <p className="detailDescription">{pageData.description}</p>
        <div className="detailField">
          <span>Сцепление шины (mu_tire)</span>
          <b>{pageData.mu_tire.toFixed(2)}</b>
        </div>
        <div className="detailField">
          <span>Сцепление покрытия (mu_surface)</span>
          <b>{pageData.mu_surface.toFixed(2)}</b>
        </div>
        <Button onClick={() => navigate(`${ROUTES.FEED}/${pageData.id}`)}>
          Открыть в ленте
        </Button>
      </div>
    </div>
  );
};
