import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Кэш текстовых эмбеддингов: id услуги -> вектор её описания на английском.
// Эмбеддинг описания считается один раз, при первом поиске по изображению, и дальше берётся отсюда
interface SearchState {
  textEmbeddings: Record<number, number[]>;
}

const initialState: SearchState = {
  textEmbeddings: {},
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    addTextEmbeddings(state, action: PayloadAction<Record<number, number[]>>) {
      Object.assign(state.textEmbeddings, action.payload);
    },
  },
});

export const { addTextEmbeddings } = searchSlice.actions;
export default searchSlice.reducer;
