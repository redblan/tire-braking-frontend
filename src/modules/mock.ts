import { TireCondition } from "./tireApi";

// Услуги для работы без бэкенда (только гость)
export const TIRE_CONDITIONS_MOCK: TireCondition[] = [
  {
    id: 1,
    name: "Сухой асфальт, летние шины",
    description:
      "Базовые условия для расчёта: чистое сухое покрытие и летние шины с хорошим протектором.",
    description_en: "Summer tires on dry asphalt, high grip and short braking distance",
    image_url: "/mock/dry.jpg",
    model_url: "",
    mu_tire: 0.9,
    mu_surface: 0.85,
    angle_x: 20,
    angle_y: 35,
    is_owner: 0,
  },
  {
    id: 2,
    name: "Мокрый асфальт, летние шины",
    description:
      "После дождя сцепление покрытия заметно падает, тормозной путь становится длиннее.",
    description_en: "Summer tires on wet asphalt, medium grip and medium braking distance",
    image_url: "/mock/wet.jpg",
    model_url: "",
    mu_tire: 0.9,
    mu_surface: 0.55,
    angle_x: 60,
    angle_y: 120,
    is_owner: 0,
  },
  {
    id: 3,
    name: "Снег, зимние шины",
    description:
      "Укатанный снег и зимние шины: сцепление шины хорошее, а покрытия низкое.",
    description_en: "Winter tires on packed snow, medium grip and long braking distance",
    image_url: "/mock/snow.jpg",
    model_url: "",
    mu_tire: 0.75,
    mu_surface: 0.25,
    angle_x: 110,
    angle_y: 200,
    is_owner: 0,
  },
  {
    id: 4,
    name: "Гололёд, всесезонные шины",
    description:
      "Самые тяжёлые условия: тонкий лёд на дороге, тормозной путь максимальный.",
    description_en: "All-season tires on ice, low grip and long braking distance",
    image_url: "",
    model_url: "",
    mu_tire: 0.7,
    mu_surface: 0.15,
    angle_x: 150,
    angle_y: 45,
    is_owner: 0,
  },
  {
    id: 5,
    name: "Сухой асфальт, изношенные шины",
    description:
      "Покрытие хорошее, но протектор изношен, поэтому сцепление шины снижено.",
    description_en: "Worn tires on dry asphalt, medium grip and medium braking distance",
    image_url: "",
    model_url: "",
    mu_tire: 0.45,
    mu_surface: 0.85,
    angle_x: 210,
    angle_y: 300,
    is_owner: 0,
  },
  {
    id: 6,
    name: "Мокрый асфальт, изношенные шины",
    description:
      "Сочетание мокрого покрытия и изношенных шин — тормозной путь резко растёт.",
    description_en: "Worn tires on wet asphalt, low grip and long braking distance",
    image_url: "",
    model_url: "",
    mu_tire: 0.45,
    mu_surface: 0.55,
    angle_x: 280,
    angle_y: 90,
    is_owner: 0,
  },
];
