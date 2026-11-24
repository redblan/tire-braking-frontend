import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../api";
import { TIRE_CONDITIONS_MOCK } from "../modules/mock";
import { FeedItem, toFeedItem } from "../modules/tireApi";
import type { RootState } from "./index";

// Лента: одна услуга, которую сейчас показывает страница
interface FeedState {
  item: FeedItem | null;
  loading: boolean;
  notFound: boolean;
  fromMock: boolean; // бэкенд недоступен — показаны mock-услуги
  pollTick: number; // растёт после каждого опроса, чтобы Short Polling запланировал следующий
}

const initialState: FeedState = {
  item: null,
  loading: false,
  notFound: false,
  fromMock: false,
  pollTick: 0,
};

interface FeedQuery {
  id?: number;
  next?: boolean;
}

interface FeedResult {
  item: FeedItem;
  fromMock: boolean;
}

// Услуга ленты из mock-коллекции: без id — первая, с next — следующая по кругу
const mockFeedItem = ({ id, next }: FeedQuery): FeedItem | undefined => {
  const index = TIRE_CONDITIONS_MOCK.findIndex((item) => item.id === id);
  let found = TIRE_CONDITIONS_MOCK[0];
  if (id && index >= 0) {
    found = next
      ? TIRE_CONDITIONS_MOCK[(index + 1) % TIRE_CONDITIONS_MOCK.length]
      : TIRE_CONDITIONS_MOCK[index];
  } else if (id && !next) {
    return undefined;
  }
  const position = TIRE_CONDITIONS_MOCK.indexOf(found) + 1;
  return { ...found, is_liked: 0, position };
};

// GET /api/tire-conditions/feed: без id — первая услуга ленты, id — услуга, id + next — следующая после неё.
// С next=true бэкенд запускает асинхронный сервис, который через 5–10 секунд меняет углы 3D модели
export const fetchFeedItem = createAsyncThunk<FeedResult, FeedQuery, { state: RootState }>(
  "feed/fetchFeedItem",
  async (query, { getState, rejectWithValue }) => {
    try {
      const response = await api.api.tireConditionsFeedList(
        { id: query.id, next: query.next || undefined },
        { secure: true },
      );
      return { item: toFeedItem(response.data), fromMock: false };
    } catch (error) {
      const status = (error as { response?: { status?: number } }).response?.status;
      // бэкенд недоступен (нет ответа или ошибка прокси): гость видит mock-услуги
      if ((!status || status >= 500) && !getState().auth.isAuthenticated) {
        const item = mockFeedItem(query);
        if (item) return { item, fromMock: true };
      }
      return rejectWithValue("Услуга не найдена");
    }
  },
);

// Short Polling: тот же метод ленты по id услуги, без анимации загрузки — обновляет углы 3D модели
export const pollFeedItem = createAsyncThunk<FeedItem, number>(
  "feed/pollFeedItem",
  async (id) => {
    const response = await api.api.tireConditionsFeedList({ id }, { secure: true });
    return toFeedItem(response.data);
  },
);

// POST /api/tire-conditions/{id}/like: value 1 — поставить лайк, 0 — снять
export const likeTireCondition = createAsyncThunk<number, { id: number; value: number }>(
  "feed/likeTireCondition",
  async ({ id, value }, { rejectWithValue }) => {
    try {
      await api.api.tireConditionsLikeCreate(id, { value });
      return value;
    } catch {
      return rejectWithValue("Не удалось поставить лайк");
    }
  },
);

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedItem.pending, (state) => {
        state.loading = true;
        state.notFound = false;
      })
      .addCase(fetchFeedItem.fulfilled, (state, action) => {
        state.loading = false;
        state.item = action.payload.item;
        state.fromMock = action.payload.fromMock;
      })
      .addCase(fetchFeedItem.rejected, (state) => {
        state.loading = false;
        state.notFound = true;
      })
      .addCase(pollFeedItem.fulfilled, (state, action) => {
        state.pollTick += 1;
        // ответ опроса применяется, только если на странице всё ещё та же услуга
        if (state.item && state.item.id === action.payload.id) {
          state.item = action.payload;
        }
      })
      .addCase(pollFeedItem.rejected, (state) => {
        state.pollTick += 1;
      })
      .addCase(likeTireCondition.pending, (state) => {
        state.loading = true;
      })
      .addCase(likeTireCondition.fulfilled, (state, action) => {
        state.loading = false;
        if (state.item) state.item.is_liked = action.payload;
      })
      .addCase(likeTireCondition.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default feedSlice.reducer;
