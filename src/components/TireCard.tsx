import { FC, ReactNode } from "react";
import { Button, Card } from "react-bootstrap";
import { DEFAULT_IMAGE, mediaUrl } from "../config";
import "./TireCard.css";

interface ICardProps {
  image_url: string;
  name: string;
  mu_tire: number;
  mu_surface: number;
  onClick: () => void;
  onDelete?: () => void; // передаётся только для своих услуг — тогда на карточке есть кнопка удаления
  footer?: ReactNode; // блок под карточкой: близость к изображению в результатах поиска
}

// уровень сцепления шины — цвет метки на карточке
const gripLevel = (mu: number) => (mu < 0.4 ? "low" : mu < 0.8 ? "medium" : "high");

export const TireCard: FC<ICardProps> = ({
  image_url,
  name,
  mu_tire,
  mu_surface,
  onClick,
  onDelete,
  footer,
}) => {
  return (
    <Card className="card tireCard" onClick={onClick}>
      <div className="cardImageWrap">
        <Card.Img
          className="cardImage"
          variant="top"
          src={mediaUrl(image_url, DEFAULT_IMAGE)}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = DEFAULT_IMAGE;
          }}
        />
      </div>
      <Card.Body>
        <Card.Title className="cardTitle">{name}</Card.Title>
        <div className="cardChips">
          <span className={`cardChip cardChip-${gripLevel(mu_tire)}`}>шина {mu_tire.toFixed(2)}</span>
          <span className="cardChip">покрытие {mu_surface.toFixed(2)}</span>
        </div>
        {footer}
        {onDelete && (
          <Button
            className="cardButton"
            variant="outline-danger"
            size="sm"
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
          >
            Удалить
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};
