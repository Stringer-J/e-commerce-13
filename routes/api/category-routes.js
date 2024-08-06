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
    //finds id
    const categoryId = parseInt(req.params.id, 10);
    //findOne where the id param is the categoryId
    const category = await Category.findOne({
      where: { id: categoryId },
    });
    //returns category if okay
    res.status(200).json(category);
  } catch (error) {
    //gives 500 error if it can't find the category
    console.error(error);
    res.status(500).json({ message: 'Failed to find category'});
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    //makes category name the body
    const { category_name } = req.body;
    //creates new category based on category name
    const newCategory = await Category.create({ category_name });
    //returns new category
    res.status(201).json(newCategory);
  } catch (error) {
    //error if category failed to create
    console.error(error);
    res.status(500).json({ message: 'Failed to create category'});
  }
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  //finds id
  const categoryId = parseInt(req.params.id, 10);
  //makes category name the body
  const { category_name } = req.body;

  //updates category if category name id equals categoryId
  Category.update({ category_name }, { where: { id: categoryId } })
  //creates new array
  .then(([rowsUpdated]) => {
    //if param doesn't exist, show error
    if (rowsUpdated === 0) {
      return res.status(404).json({ message: 'Category not found'});
    }
    //if it does, return by primary key
    return Category.findByPk(categoryId);
  })
  //then returns updated category
  .then((updatedCategory) => {
    res.status(200).json(updatedCategory);
  })
  //error if it fails
  .catch((err) => {
    console.error('Error updating category:', err);
    res.status(500).json({ message: 'Failed to update category', error: err.message });
  });
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  //finds category id
  const categoryId = parseInt(req.params.id, 10);
  //if category id isn't a number, return error
  if (isNaN(categoryId)) {
    return res.status(400).json({ message: 'Invalid category ID'});
  }

  try {
  //links products associated with category id
  const linkedProducts = await Product.findAll({ where: { category_id: categoryId } });
  //if there are any products (more than 0), then delete products with category
  if (linkedProducts.length > 0) {
    await Product.destroy({ where: { category_id: categoryId } });
  }
  //variable for items to delete
  const deleted = await Category.destroy({
    where: { id: categoryId }
  });

    //if the item doesn't exist, error
    if (deleted === 0) {
      return res.status(404).json({ message: 'Category not found'});
    }
    //if it does exist, it deletes
    res.status(200).json({ message: 'Category deleted successfully'});
  } catch (err) {
      //errors if it can't delete
      console.error('Error deleting category:', err);
      res.status(500).json({ message: 'Failed to delete category', error: err.message});
  }
});

module.exports = router;
