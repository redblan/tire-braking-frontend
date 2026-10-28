import { FC } from "react";
import { Card } from "react-bootstrap";
import "./TireCard.css";

interface ICardProps {
  image_url: string;
  name: string;
  mu_tire: number;
  mu_surface: number;
  onClick: () => void;
}

const defaultImage = "/DefaultImage.jpg";

export const TireCard: FC<ICardProps> = ({
  image_url,
  name,
  mu_tire,
  mu_surface,
  onClick,
}) => {
  return (
    <Card className="card" onClick={onClick}>
      <Card.Img
        className="cardImage"
        variant="top"
        src={image_url || defaultImage}
        height={100}
        width={100}
      />
      <Card.Body>
        <div className="textStyle">
          <Card.Title>{name}</Card.Title>
        </div>
        <div className="textStyle">
          <Card.Text>
            шина {mu_tire.toFixed(2)} · покрытие {mu_surface.toFixed(2)}
          </Card.Text>
        </div>
      </Card.Body>
    </Card>
  );
};
