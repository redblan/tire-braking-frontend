import { TireConditionsResult } from "./tireApi";

export const TIRE_CONDITIONS_MOCK: TireConditionsResult = {
  resultCount: 6,
  results: [
    {
      id: 1,
      name: "Сухой асфальт, летние шины",
      description:
        "Базовые условия для расчёта: чистое сухое покрытие и летние шины с хорошим протектором.",
      image_url: "/mock/dry.jpg",
      video_url: "/mock/dry.webm",
      mu_tire: 0.9,
      mu_surface: 0.85,
    },
    {
      id: 2,
      name: "Мокрый асфальт, летние шины",
      description:
        "После дождя сцепление покрытия заметно падает, тормозной путь становится длиннее.",
      image_url: "/mock/wet.jpg",
      video_url: "",
      mu_tire: 0.9,
      mu_surface: 0.55,
    },
    {
      id: 3,
      name: "Снег, зимние шины",
      description:
        "Укатанный снег и зимние шины: сцепление шины хорошее, а покрытия низкое.",
      image_url: "/mock/snow.jpg",
      video_url: "",
      mu_tire: 0.75,
      mu_surface: 0.25,
    },
    {
      id: 4,
      name: "Гололёд, всесезонные шины",
      description:
        "Самые тяжёлые условия: тонкий лёд на дороге, тормозной путь максимальный.",
      image_url: "",
      video_url: "",
      mu_tire: 0.7,
      mu_surface: 0.15,
    },
    {
      id: 5,
      name: "Сухой асфальт, изношенные шины",
      description:
        "Покрытие хорошее, но протектор изношен, поэтому сцепление шины снижено.",
      image_url: "",
      video_url: "",
      mu_tire: 0.45,
      mu_surface: 0.85,
    },
    {
      id: 6,
      name: "Мокрый асфальт, изношенные шины",
      description:
        "Сочетание мокрого покрытия и изношенных шин — тормозной путь резко растёт.",
      image_url: "",
      video_url: "",
      mu_tire: 0.45,
      mu_surface: 0.55,
    },
  ],
};
