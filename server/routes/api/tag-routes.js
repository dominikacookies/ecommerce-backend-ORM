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

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
});

router.post('/', (req, res) => {
  // create a new tag
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
