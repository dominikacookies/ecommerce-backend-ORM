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

// const travellerData = await Traveller.findByPk(req.params.id, {
//   // JOIN with locations, using the Trip through table
//   include: [{ model: Location, through: Trip, as: 'planned_trips' }]
// });

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
});

router.post('/', (req, res) => {
  // create a new category
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
