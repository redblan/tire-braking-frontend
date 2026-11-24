import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../api";
import { PAGE_LIMIT } from "../config";
import { TIRE_CONDITIONS_MOCK } from "../modules/mock";
import { TireCondition, toTireCondition } from "../modules/tireApi";
import type { RootState } from "./index";

// Плитка услуг: страница списка, фильтр по сцеплению шины и пагинация
interface TireConditionsState {
  list: TireCondition[];
  grip: string; // фильтр: минимальный mu_tire
  currentPage: number;
  totalPages: number;
  total: number;
  loading: boolean;
  fromMock: boolean; // бэкенд недоступен — показаны mock-услуги
}

const initialState: TireConditionsState = {
  list: [],
  grip: "",
  currentPage: 1,
  totalPages: 1,
  total: 0,
  loading: false,
  fromMock: false,
};

interface TireConditionsPage {
  list: TireCondition[];
  total: number;
  fromMock: boolean;
}

const parseGrip = (grip: string) => Number(grip.replace(",", "."));

// Страница услуг из mock-коллекции с тем же фильтром и пагинацией, что и у бэкенда
const mockPage = (grip: string, page: number): TireConditionsPage => {
  const filtered = TIRE_CONDITIONS_MOCK.filter(
    (item) => !grip || item.mu_tire >= parseGrip(grip),
  );
  const offset = (page - 1) * PAGE_LIMIT;
  return {
    list: filtered.slice(offset, offset + PAGE_LIMIT),
    total: filtered.length,
    fromMock: true,
  };
};

// GET /api/tire-conditions: фильтр и номер страницы берутся из состояния
export const fetchTireConditions = createAsyncThunk<
  TireConditionsPage,
  void,
  { state: RootState }
>("tireConditions/fetchTireConditions", async (_, { getState, rejectWithValue }) => {
  const { grip, currentPage } = getState().tireConditions;
  try {
    const response = await api.api.tireConditionsList(
      {
        grip: grip ? parseGrip(grip) : undefined,
        page: currentPage,
        limit: PAGE_LIMIT,
      },
      { secure: true },
    );
    return {
      list: (response.data.data ?? []).map(toTireCondition),
      total: response.data.total ?? 0,
      fromMock: false,
    };
  } catch {
    // бэкенд недоступен: гость видит mock-услуги
    if (!getState().auth.isAuthenticated) {
      return mockPage(grip, currentPage);
    }
    return rejectWithValue("Не удалось загрузить услуги");
  }
});

// DELETE /api/tire-conditions/{id}: удаление своей услуги, затем страница загружается заново
export const deleteTireCondition = createAsyncThunk<void, number, { state: RootState }>(
  "tireConditions/deleteTireCondition",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await api.api.tireConditionsDelete(id);
      await dispatch(fetchTireConditions());
    } catch {
      return rejectWithValue("Не удалось удалить услугу");
    }
  },
);

const tireConditionsSlice = createSlice({
  name: "tireConditions",
  initialState,
  reducers: {
    // новый фильтр — показ с первой страницы
    setGrip(state, action: PayloadAction<string>) {
      state.grip = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    // сброс фильтра при выходе пользователя
    resetFilter(state) {
      state.grip = "";
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTireConditions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTireConditions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.total = action.payload.total;
        state.totalPages = Math.max(1, Math.ceil(action.payload.total / PAGE_LIMIT));
        state.fromMock = action.payload.fromMock;
      })
      .addCase(fetchTireConditions.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteTireCondition.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTireCondition.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setGrip, setCurrentPage, resetFilter } = tireConditionsSlice.actions;
export default tireConditionsSlice.reducer;
