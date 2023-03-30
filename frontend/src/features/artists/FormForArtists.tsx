import React, { useState } from 'react';
import { Button, Grid, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import FileInput from '../../components/UI/FileInput/FileInput';
import { CocktailApi } from '../../../types';
import { useNavigate } from 'react-router-dom';
import { addArtist, fetchArtists } from './artistsThunks';
import { selectAddArtistLoading } from './artistsSlice';

const FormForArtists = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const addArtistLoading = useAppSelector(selectAddArtistLoading);
  const [ingredientsFields, setIngredientsFields] = useState<JSX.Element[]>([]);

  const [state, setState] = useState<CocktailApi>({
    name: '',
    recipe: '',
    image: null,
    ingredients: [],
  });

  const submitFormHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(
      addArtist({
        name: state.name,
        recipe: state.recipe,
        image: state.image,
        ingredients: state.ingredients,
      }),
    );
    setState({ name: '', recipe: '', image: null, ingredients: [] });
    await dispatch(fetchArtists());
    navigate('/');
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setState((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const inputIngredientsChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setState((prevState) => {
      const newIngredients = [...prevState.ingredients];
      newIngredients[index] = { ...newIngredients[index], [name]: value };
      return { ...prevState, ingredients: newIngredients };
    });
  };

  console.log(state);

  const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setState((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        [name]: null,
      }));
    }
  };

  const addIngredientField = (index: number) => {
    const newIngredientField = (
      <Grid key={Date.now()} container justifyContent="space-between">
        <Grid item sx={{ width: '75%', mb: 1 }}>
          <TextField
            id="name"
            label="Ingredient Name"
            value={state.ingredients[index]}
            onChange={(e) => inputIngredientsChangeHandler(e, index)}
            name="name"
            required
          />
        </Grid>
        <Grid item>
          <TextField
            id="amount"
            label="Amount"
            value={state.ingredients[index]}
            onChange={(e) => inputIngredientsChangeHandler(e, index)}
            name="amount"
            required
          />
        </Grid>
      </Grid>
    );
    setIngredientsFields((prev) => [...prev, newIngredientField]);
    setState((prevState) => ({ ...prevState, ingredients: [...prevState.ingredients, { name: '', amount: '' }] }));
  };

  let disabled = false;

  if (addArtistLoading) {
    disabled = true;
  }

  return (
    <form autoComplete="off" onSubmit={submitFormHandler}>
      <Grid item container justifyContent="space-between" alignItems="center" xs sx={{ mb: 1 }}>
        <TextField
          sx={{ width: '100%' }}
          id="name"
          label="Name"
          value={state.name}
          onChange={inputChangeHandler}
          name="name"
          required
        />
      </Grid>

      <Grid item xs sx={{ mb: 1 }}>
        {ingredientsFields}
        <Button onClick={() => addIngredientField(state.ingredients.length)} color="primary" variant="contained">
          Add ingredient
        </Button>
      </Grid>

      <Grid container direction="column" spacing={2} sx={{ mb: 1 }}>
        <Grid item xs>
          <TextField
            sx={{ width: 1 }}
            multiline
            rows={3}
            id="recipe"
            label="Recipe"
            value={state.recipe}
            onChange={inputChangeHandler}
            name="recipe"
          />
        </Grid>

        <Grid item xs>
          <FileInput onChange={fileInputChangeHandler} name="image" label="Image" />
        </Grid>
      </Grid>

      <Button disabled={disabled} type="submit" color="primary" variant="contained">
        Add artist
      </Button>
    </form>
  );
};

export default FormForArtists;
