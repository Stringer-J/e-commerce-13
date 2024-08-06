const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get categories'});
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryId = parseInt(req.params.id, 10);
    const category = await Category.findOne({
      where: { id: categoryId },
    });
    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to find category'});
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const { category_name } = req.body;
    const newCategory = await Category.create({ category_name });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create category'});
  }
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  const categoryId = parseInt(req.params.id, 10);
  const { category_name } = req.body;

  Category.update({ category_name }, { where: { id: categoryId } })
  .then(([rowsUpdated]) => {
    if (rowsUpdated === 0) {
      return res.status(404).json({ message: 'Category not found'});
    }
    return Category.findByPk(categoryId);
  })
  .then((updatedCategory) => {
    res.status(200).json(updatedCategory);
  })
  .catch((err) => {
    console.error('Error updating category:', err);
    res.status(500).json({ message: 'Failed to update category', error: err.message });
  });
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  const categoryId = parseInt(req.params.id, 10);

  if (isNaN(categoryId)) {
    return res.status(400).json({ message: 'Invalid category ID'});
  }

  try {
  const linkedProducts = await Product.findAll({ where: { category_id: categoryId } });

  if (linkedProducts.length > 0) {
    await Product.destroy({ where: { category_id: categoryId } });
  }

  const deleted = await Category.destroy({
    where: { id: categoryId }
  });

    if (deleted === 0) {
      return res.status(404).json({ message: 'Category not found'});
    }

    res.status(200).json({ message: 'Category deleted successfully'});
  } catch (err) {
      console.error('Error deleting category:', err);
      res.status(500).json({ message: 'Failed to delete category', error: err.message});
  }
});

module.exports = router;
