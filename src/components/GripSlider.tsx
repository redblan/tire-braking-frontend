import { FC } from "react";
import { Button } from "react-bootstrap";
import "./GripSlider.css";

interface Props {
  value: number; // минимальный коэффициент сцепления шины; 0 — без фильтра
  setValue: (value: number) => void;
  onSubmit: () => void;
  loading?: boolean;
}

// границы и шаг ползунка: mu_tire услуг лежит в пределах 0–1.20
const MIN = 0;
const MAX = 1.2;
const STEP = 0.05;

// Фильтр плитки: ползунок минимального сцепления шины и кнопка, которая применяет фильтр
export const GripSlider: FC<Props> = ({ value, setValue, onSubmit, loading }) => (
  <div className="gripSlider">
    <label className="gripSliderLabel" htmlFor="gripSliderInput">
      Мин. коэффициент сцепления: <b>{value.toFixed(2)}</b>
    </label>
    <input
      id="gripSliderInput"
      className="gripSliderInput"
      type="range"
      min={MIN}
      max={MAX}
      step={STEP}
      value={value}
      onChange={(event) => setValue(Number(event.target.value))}
    />
    <Button disabled={loading} onClick={onSubmit}>
      Применить фильтр
    </Button>
  </div>
);
