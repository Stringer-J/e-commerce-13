const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tags = await Tag.findAll({ include: Product });
    res.status(200).json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get tags' });
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagId = parseInt(req.params.id, 10);
    const tag = await Tag.findOne({
      where: { id: tagId },
      include: [{ model: Product }]
    });
    res.status(200).json(tag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to find tag' });
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
  const { id, tag_name } = req.body;
  const newTag = await Tag.create({ id, tag_name });
  res.status(201).json(newTag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create tag' });
  }
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  const tagId = parseInt(req.params.id, 10);
  const { tag_name } = req.body;

  Tag.update({ tag_name }, { where: { id: tagId } })
  .then(([rowsUpdated]) => {
    if (rowsUpdated === 0) {
      return res.status(404).json({ message: 'Tag not found'});
    }
    return Tag.findByPk(tagId);
  })
  .then((updatedTag) => {
    res.status(200).json(updatedTag);
  })
  .catch((err) => {
    console.error('Error updating tag:', err);
    res.status(500).json({ message: 'Failed to update tag', error: err.message });
  });
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
