const Joi = require('joi');
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
  const { _id } = req.user;
  const result = await recipeModels.registerRecipe(name, ingredients, preparation, _id);
  res.status(201).json(result);
};

const listRecipes = async (_req, res, _next) => {
  const result = await recipeModels.listRecipes();
  res.status(200).json(result);
};

const listRecipesById = async (req, res, _next) => {
  const { id } = req.params;
  const result = await recipeModels.listRecipesById(id);
  if (!result) return res.status(404).json({ message: 'recipe not found' });
  res.status(200).json(result);
};

module.exports = {
  registerRecipe,
  listRecipes,
  listRecipesById,
};