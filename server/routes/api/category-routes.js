const router = require('express').Router();
const { Category, Product, ProductTag } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      include: [{
        model: Product, 
        as: 'products'
      }]
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json({
      error: "Sorry, we're unable to get category data at this time"
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, { 
      include: [{
            model: Product,
            as: 'products'
      }]
    });
    if (!category) {
      res.status(404).json({error: "No category found with this id"})
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({
      error: "Sorry, we couldn't get your category information at this time"
    })
  }
});

// create a new category
router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json({
      message: "A new category has been successfully created",
      category: newCategory,
    })
  } catch (error) {
    console.log(error)
  }
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
