const Joi = require('joi');
const recipeServices = require('../services/recipes');
const recipeModels = require('../models/recipes');

const registerJoi = Joi.object({
  name: Joi.string().not().empty().required(),
  ingredients: Joi.string().not().empty().required(),
  preparation: Joi.string().not().empty().required(),
});

const registerRecipe = async (req, res, _next) => {
  const { error } = registerJoi.validate(req.body);

  if (error) {
    return res.status(400).json({ message: 'Invalid entries. Try again.' });
  }
  const { name, ingredients, preparation } = req.body;
  const { id } = req.user;
  const result = await recipeModels.registerRecipe(name, ingredients, preparation, id);
  res.status(201).json(result);
};

const listRecipes = async (_req, res, _next) => {
  const result = await recipeModels.listRecipes();
  res.status(200).json(result);
};

const listRecipeById = async (req, res, _next) => {
  const { id } = req.params;
  const result = await recipeModels.listRecipeById(id);
  if (!result) return res.status(404).json({ message: 'recipe not found' });
  res.status(200).json(result);
};

const editRecipe = async (req, res, next) => {
  const { id } = req.params;
  const { id: userId, role } = req.user;
  const result = await recipeServices.editRecipe(id, req.body, userId, role);
  if (result.error) return next(result.error);
  res.status(200).json(result);
};

const deleteRecipe = async (req, res, next) => {
  const { id } = req.params;
  const { id: userId, role } = req.user;
  const result = await recipeServices.deleteRecipe(id, userId, role);
  if (result.error) return next(result.error);
  res.status(204).end();
};

const addImg = async (req, res, next) => {
  const { id } = req.params;
  const { id: userId, role } = req.user;
  const { filename } = req.file;
  const result = await recipeServices.addImg(id, userId, role, filename);
  if (result.error) return next(result.error);
  res.status(200).json(result);
};

module.exports = {
  registerRecipe,
  listRecipes,
  listRecipeById,
  editRecipe,
  deleteRecipe,
  addImg,
};
