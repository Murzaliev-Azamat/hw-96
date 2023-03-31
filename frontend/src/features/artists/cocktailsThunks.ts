import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import { Cocktail, CocktailApi } from '../../../types';

export const fetchCocktails = createAsyncThunk<Cocktail[]>('cocktails/fetchAll', async () => {
  const cocktailsResponse = await axiosApi.get<Cocktail[]>('/cocktails');
  return cocktailsResponse.data;
});

export const addCocktail = createAsyncThunk<void, CocktailApi>('cocktails/addCocktail', async (cocktail) => {
  const formData = new FormData();

  // const keys = Object.keys(cocktail) as (keyof CocktailApi)[];
  // keys.forEach((key) => {
  //   const value = cocktail[key];
  //
  //   if (value !== null) {
  //     if (Array.isArray(value) && key === 'ingredients') {
  //       formData.append('ingredients', JSON.stringify(value));
  //     } else {
  //       formData.append(key, value);
  //     }
  //   }

  Object.entries(cocktail).forEach(([key, value]) => {
    if (value !== null) {
      if (Array.isArray(value) && key === 'ingredients') {
        formData.append('ingredients', JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    }
  });

  await axiosApi.post<CocktailApi>('/cocktails', formData);
});

export const publishCocktail = createAsyncThunk<void, string>('cocktails/publishCocktail', async (id) => {
  await axiosApi.patch('/cocktails/' + id + '/togglePublished');
});

export const deleteCocktail = createAsyncThunk<void, string>('cocktails/deleteCocktail', async (id) => {
  await axiosApi.delete('/cocktails/' + id);
});
