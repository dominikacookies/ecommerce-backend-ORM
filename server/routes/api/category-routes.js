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
// TO DO: destructure response to check category name exists before making request
router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json({
      message: "A new category has been successfully created",
      category: newCategory,
    })
  } catch (error) {
    res.status(500).json({error: "Sorry, we were unable to create a new category at this time. Please try again later."})
  }
});

// update a category by its `id` value
router.put('/:id', (req, res) => {
});

  // delete a category by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const categoryData = await Category.destroy({
      where: { id : req.params.id}
    });

    if (!categoryData) {
      res.status(404).json({message: "We couldn't find a category with this ID"});
    };

    res.status(200).json({
      message: "The category has been successfully deleted",
      available_categories: categoryData
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "We were unable to delete the category at this time. Please try again later."
    }) 
  }
});

module.exports = router;
