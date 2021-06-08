const router = require('express').Router();
const { Category, Product} = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      include: [{
        model: Product, 
        as: 'products'
      }]
    });

    if (!categoryData.length) {
      return res.status(404).json({
        error: "No categories found"
      });
    }
    return res.status(200).json(categoryData);
  } catch (err) {
    return res.status(500).json({
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
      return res.status(404).json({
        error: "No category found with this id"
      })
    }

    return res.status(200).json(category);

  } catch (error) {
    return res.status(500).json({
      error: "Sorry, we couldn't get your category information at this time"
    })
  }
});

// create a new category
router.post('/', async (req, res) => {
  try {
    const { category_name } = req.body
    
    if (!category_name) {
      return res.status(400).json({
        error: "Values undefined",
        message: "Please provide a category name."
      })
    }

    const newCategory = await Category.create(req.body);
    return res.status(200).json({
      message: "A new category has been successfully created",
      category: newCategory,
    })
  } catch (error) {
    return res.status(500).json({
      error: "Sorry, we were unable to create a new category at this time. Please try again later."
    })
  }
});

// update a category by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const {category_name} = req.body
    const {id} = req.params

    if (!category_name) {
      return res.status(400).json({
        error: "Values undefined",
        message: "Please provide the new category name and id of the category you'd like to update."
      })
    }

    const updateResult = await Category.update( {category_name}, {
      where: {
        id
      },
    })

    if (updateResult[0] == 0) {
      return res.status(404).json({
        error: "Category doesn't exist"
      })
    };

    return res.status(200).json({
      message: "successfully updated category"
    });

  } catch (error) {
    return res.status(500).json({
      error: "Sorry, we couldn't update your category at this time"
    });
  }
});

  // delete a category by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const {id} = req.params

    const deleteResult = await Category.destroy({
      where: { id }
    });

    if (deleteResult === 0) {
      return res.status(404).json({
        error: "Category doesn't exist"
      })
    };

    return res.status(200).json({
      message: "The category has been successfully deleted",
    });

  } catch (error) {
    return res.status(500).json({
      error: "We were unable to delete the category at this time. Please try again later."
    }) 
  }
});

module.exports = router;
