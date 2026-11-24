import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api";
import { TireCondition, toTireCondition } from "../modules/tireApi";

// Страница добавления: черновик услуги текущего пользователя
interface DraftState {
  draft: TireCondition | null;
  loading: boolean;
  error: string;
}

const initialState: DraftState = {
  draft: null,
  loading: false,
  error: "",
};

// GET /api/tire-conditions/draft: черновика нет (404) — null
export const fetchDraftTireCondition = createAsyncThunk<TireCondition | null>(
  "draft/fetchDraftTireCondition",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.api.tireConditionsDraftList();
      return toTireCondition(response.data);
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;
      if (status === 404) return null;
      return rejectWithValue("Не удалось получить черновик");
    }
  },
);

interface NewTireCondition {
  name: string;
  image: File;
  model: File; // 3D модель .glb
}

// POST /api/tire-conditions: кнопка «Далее» — создаётся черновик, файлы уходят в Minio
export const createTireCondition = createAsyncThunk<TireCondition, NewTireCondition>(
  "draft/createTireCondition",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.api.tireConditionsCreate(data);
      return toTireCondition(response.data);
    } catch {
      return rejectWithValue("Не удалось создать услугу");
    }
  },
);

interface PublishData {
  id: number;
  description: string;
  description_en: string; // краткое описание на английском, 50–100 символов
  mu_tire: number;
  mu_surface: number;
}

// PUT /api/tire-conditions/{id}/publish: кнопка «Опубликовать»
export const publishTireCondition = createAsyncThunk<void, PublishData>(
  "draft/publishTireCondition",
  async ({ id, ...body }, { rejectWithValue }) => {
    try {
      await api.api.tireConditionsPublishUpdate(id, body);
    } catch {
      return rejectWithValue("Не удалось опубликовать: коэффициенты больше 0, описание на английском — 50–100 символов латиницей");
    }
  },
);

const draftSlice = createSlice({
  name: "draft",
  initialState,
  reducers: {
    // выход пользователя — черновик другого пользователя не должен остаться на странице
    clearDraft() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDraftTireCondition.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchDraftTireCondition.fulfilled, (state, action) => {
        state.loading = false;
        state.draft = action.payload;
      })
      .addCase(fetchDraftTireCondition.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload ?? "");
      })
      .addCase(createTireCondition.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(createTireCondition.fulfilled, (state, action) => {
        state.loading = false;
        state.draft = action.payload;
      })
      .addCase(createTireCondition.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload ?? "");
      })
      .addCase(publishTireCondition.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(publishTireCondition.fulfilled, (state) => {
        state.loading = false;
        state.draft = null;
      })
      .addCase(publishTireCondition.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload ?? "");
      });
  },
});

export const { clearDraft } = draftSlice.actions;
export default draftSlice.reducer;
