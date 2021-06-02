const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// find all tags
router.get('/', async (req, res) => {
  try {
    const allTags = await Tag.findAll({
      include: [{
                  model: Product,
                  as: 'products',
                  through: ProductTag
                }]
    })
    if (!allTags) {
      res.status(404).json({ message: "There are no tags at the moment."})
    }
    res.status(200).json(allTags)
  } catch (error) {
    console.log(error)
    res.status(500).json({error: "Sorry we couldn't get all tag information at this time. Please try again later."})
  }
});

// find a single tag by its `id`
router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, { 
      include: [{
        model: Product,
        as: 'products',
      }]
    });
    if (!tag) {
      res.status(404).json({error: "No tag found with this id"})
    }
    res.status(200).json(product);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Sorry, we couldn't get your tag information at this time"})
  }
});

// create a new tag
router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(200).json({
      message: "A new tag has been successfully created",
      category: newTag,
    })
  } catch (error) {
    res.status(500).json({error: "Sorry, we were unable to create a new tag at this time. Please try again later."})
  }
});

// update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const {tag_name} = req.body
    await Tag.update( {tag_name}, {
      where: {
        id: req.params.id,
      },
    })
    res.status(200).json({message: "successfully updated tag"})
  } catch (error) {
    res.status(500).json({error: "Sorry, we couldn't update your tag at this time"})
  }
});

// delete on tag by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    await Tag.destroy({
      where: { id : req.params.id}
    });

    res.status(200).json({
      message: "The tag has been successfully deleted",
    })
  } catch (error) {
    res.status(500).json({
      message: "We were unable to delete the tag at this time. Please try again later."
    }) 
  }
});

module.exports = router;
