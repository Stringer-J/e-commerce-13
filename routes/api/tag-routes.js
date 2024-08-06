const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tags = await Tag.findAll();
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
    //finds id
    const tagId = parseInt(req.params.id, 10);
    //findOne where the id param is the tagId
    const tag = await Tag.findOne({
      where: { id: tagId },
    });
    //returns tag if okay
    res.status(200).json(tag);
  } catch (error) {
    //gives 500 error if it can't find the tag
    console.error(error);
    res.status(500).json({ message: 'Failed to find tag' });
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
  //makes id, tag name the body
  const { id, tag_name } = req.body;
  //creates new tag based on tag name
  const newTag = await Tag.create({ id, tag_name });
  //returns new tag
  res.status(201).json(newTag);
  } catch (error) {
    //error if category failed to create
    console.error(error);
    res.status(500).json({ message: 'Failed to create tag' });
  }
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  //finds id
  const tagId = parseInt(req.params.id, 10);
  //makes tag name the body
  const { tag_name } = req.body;
  //updates tag name if id equals tagId
  Tag.update({ tag_name }, { where: { id: tagId } })
  //creates new array
  .then(([rowsUpdated]) => {
    //if param doesn't exist, show error
    if (rowsUpdated === 0) {
      return res.status(404).json({ message: 'Tag not found'});
    }
    //if it does, return by primary key
    return Tag.findByPk(tagId);
  })
  //then returns updated tag
  .then((updatedTag) => {
    res.status(200).json(updatedTag);
  })
  //error if it fails
  .catch((err) => {
    console.error('Error updating tag:', err);
    res.status(500).json({ message: 'Failed to update tag', error: err.message });
  });
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  //finds id
  const tagId = parseInt(req.params.id, 10);
  //if tag id isn't a number, error
  if (isNaN(tagId)) {
    return res.status(400).json({ message: 'Invalid tag ID'});
  }

  try { 
    //variablef for items to delete
  const deleted = await Tag.destroy({
    where: { id: tagId }
  });
    //if the item doesn't exist, error
    if (deleted === 0) {
      return res.status(404).json({ message: 'Tag not found'});
    }
    //if it does, delete
    res.status(200).json({ message: 'Tag deleted successfully'});
  } catch (err) {
    //error if it can't delete
      console.error('Error deleting tag:', err);
      res.status(500).json({ message: 'Failed to delete tag', error: err.message});
  }
});

module.exports = router;
