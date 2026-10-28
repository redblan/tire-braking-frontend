import "./TilesPage.css";
import { FC, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { InputField } from "../components/InputField";
import { TireCard } from "../components/TireCard";
import { ROUTES } from "../Routes";
import { AppOutletContext } from "../AppLayout";
import { TIRE_CONDITIONS_MOCK } from "../modules/mock";

export const TilesPage: FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [tires, setTires] = useState(TIRE_CONDITIONS_MOCK.results);
  const { setCards } = useOutletContext<AppOutletContext>();
  const navigate = useNavigate();

  useEffect(() => {
    setCards(TIRE_CONDITIONS_MOCK.results);
  }, [setCards]);

  const handleFilter = () => {
    const grip = Number(searchValue.replace(",", "."));
    const results = TIRE_CONDITIONS_MOCK.results.filter(
      (item) => !searchValue || item.mu_tire >= grip
    );
    setTires(results);
    setCards(results);
  };

  const handleCardClick = (id: number) => {
    navigate(`${ROUTES.DETAIL}/${id}`);
  };

  return (
    <div className="container">
      <InputField
        value={searchValue}
        setValue={(value) => setSearchValue(value)}
        onSubmit={handleFilter}
        placeholder="Сцепление шины от"
      />

      {!tires.length ? (
        <div>
          <h1>К сожалению, пока ничего не найдено :(</h1>
        </div>
      ) : (
        <div className="cardsList">
          {tires.map((item) => (
            <TireCard
              key={item.id}
              onClick={() => handleCardClick(item.id)}
              {...item}
            />
          ))}
        </div>
      )}
    </div>
  );
};
