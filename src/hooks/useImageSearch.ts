import { useEffect, useMemo, useRef, useState } from "react";
import { SEARCH_THRESHOLD, SEARCH_TOP_K } from "../config";
import { cosineSimilarity } from "../modules/math";
import { TireCondition } from "../modules/tireApi";
import { useAppDispatch, useAppSelector } from "../store";
import { addTextEmbeddings } from "../store/searchSlice";

// Карточка в результатах поиска: similarity — косинусное сходство эмбеддинга изображения и описания,
// score — то же сходство, приведённое к шкале 0–1 среди карточек страницы (1 — самая похожая)
export interface SearchResult {
  item: TireCondition;
  similarity: number;
  score: number;
}

type Status = "idle" | "working" | "done" | "error";

// Поиск похожих карточек по изображению среди услуг текущей страницы (items).
// Изображение сравнивается с краткими описаниями на английском: одна модель SigLIP даёт вектор и для картинки, и для текста
export const useImageSearch = (items: TireCondition[]) => {
  const dispatch = useAppDispatch();
  const textEmbeddings = useAppSelector((state) => state.search.textEmbeddings);

  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0); // загрузка модели, %
  const [error, setError] = useState("");
  const [imageEmbedding, setImageEmbedding] = useState<number[] | null>(null);
  const workerRef = useRef<Worker | null>(null);

  // воркер создаётся при первом поиске: модель тяжёлая, без поиска она не нужна
  const getWorker = () => {
    if (workerRef.current) return workerRef.current;

    const worker = new Worker(new URL("../workers/search.worker.ts", import.meta.url), {
      type: "module",
    });
    worker.onmessage = (event) => {
      const { type, data } = event.data;
      switch (type) {
        case "progress":
          if (data.status === "progress") setProgress(Math.round(data.progress));
          break;
        case "text_embeddings_ready":
          dispatch(addTextEmbeddings(data));
          break;
        case "image_embedding_ready":
          setImageEmbedding(data);
          setStatus("done");
          break;
        case "error":
          setError(data);
          setStatus("error");
          break;
      }
    };
    workerRef.current = worker;
    return worker;
  };

  useEffect(() => () => workerRef.current?.terminate(), []);

  // Запрос поиска: описания без эмбеддинга в Redux уходят на расчёт, изображение считается каждый раз
  const searchByImage = (file: File) => {
    setStatus("working");
    setError("");
    setImageEmbedding(null);
    const texts = items
      .filter((item) => item.description_en && !textEmbeddings[item.id])
      .map((item) => ({ id: item.id, text: item.description_en }));
    getWorker().postMessage({ type: "search", texts, image: file });
  };

  const resetSearch = () => {
    setStatus("idle");
    setError("");
    setImageEmbedding(null);
  };

  // Ранжирование: сходство с каждой карточкой страницы, шкала 0–1, порог и TopK
  const results = useMemo<SearchResult[] | null>(() => {
    if (!imageEmbedding) return null;

    const scored = items
      .filter((item) => textEmbeddings[item.id])
      .map((item) => ({
        item,
        similarity: cosineSimilarity(imageEmbedding, textEmbeddings[item.id]),
      }));
    if (!scored.length) return [];

    const max = Math.max(...scored.map((entry) => entry.similarity));
    const min = Math.min(...scored.map((entry) => entry.similarity));
    const range = max - min;

    return scored
      .map((entry) => ({
        ...entry,
        score: range > 0 ? (entry.similarity - min) / range : 1,
      }))
      .filter((entry) => entry.score >= SEARCH_THRESHOLD)
      .sort((a, b) => b.score - a.score)
      .slice(0, SEARCH_TOP_K);
  }, [imageEmbedding, items, textEmbeddings]);

  return { status, progress, error, results, searchByImage, resetSearch };
};
