/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  env,
  AutoTokenizer,
  AutoProcessor,
  SiglipTextModel,
  SiglipVisionModel,
  RawImage,
} from "@huggingface/transformers";

// модель скачивается с Hugging Face и кэшируется браузером (если кэш доступен)
env.allowLocalModels = false;
env.allowRemoteModels = true;
env.useBrowserCache = typeof caches !== "undefined";

const MODEL_ID = "Xenova/siglip-base-patch16-224";
// размерность эмбеддинга SigLIP base
const EMBEDDING_SIZE = 768;

// Одна модель на всё приложение: текстовая и визуальная части SigLIP, загружаются один раз
class SiglipService {
  static tokenizer: any = null;
  static processor: any = null;
  static textModel: any = null;
  static visionModel: any = null;

  static async init(progress_callback?: (data: any) => void) {
    if (!this.tokenizer) {
      // q8 — квантованные веса: меньше размер и быстрее на процессоре
      const options = { device: "wasm", dtype: "q8" } as const;

      this.tokenizer = await AutoTokenizer.from_pretrained(MODEL_ID, { progress_callback });
      this.processor = await AutoProcessor.from_pretrained(MODEL_ID, { progress_callback });
      this.textModel = await SiglipTextModel.from_pretrained(MODEL_ID, { ...options, progress_callback });
      this.visionModel = await SiglipVisionModel.from_pretrained(MODEL_ID, { ...options, progress_callback });
    }
  }
}

interface SearchMessage {
  type: "search";
  // описания на английском, для которых эмбеддинга ещё нет в Redux
  texts: { id: number; text: string }[];
  // изображение из поля поиска
  image: File;
}

self.addEventListener("message", async (event: MessageEvent<SearchMessage>) => {
  const { type, texts, image } = event.data;
  if (type !== "search") return;

  try {
    await SiglipService.init((msg) => {
      self.postMessage({ type: "progress", data: msg });
    });

    // 1. Текстовые эмбеддинги: все новые описания за один проход текстовой модели
    if (texts.length > 0) {
      const text_inputs = await SiglipService.tokenizer(
        texts.map((item) => item.text),
        { padding: "max_length", truncation: true },
      );
      const { pooler_output: textOutput } = await SiglipService.textModel(text_inputs);

      const embeddings: Record<number, number[]> = {};
      for (let i = 0; i < texts.length; i++) {
        const start = i * EMBEDDING_SIZE;
        embeddings[texts[i].id] = Array.from(textOutput.data.slice(start, start + EMBEDDING_SIZE));
      }
      self.postMessage({ type: "text_embeddings_ready", data: embeddings });
    }

    // 2. Эмбеддинг изображения — считается при каждом запросе
    const imageUrl = URL.createObjectURL(image);
    const rawImage = await RawImage.read(imageUrl);
    const imageInputs = await SiglipService.processor(rawImage);
    const { pooler_output } = await SiglipService.visionModel(imageInputs);
    URL.revokeObjectURL(imageUrl);

    self.postMessage({ type: "image_embedding_ready", data: Array.from(pooler_output.data) });
  } catch (error) {
    console.error(error);
    self.postMessage({ type: "error", data: String(error) });
  }
});
