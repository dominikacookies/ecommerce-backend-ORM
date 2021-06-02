const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const allProducts = await Prloduct.findAll({
      include: [{
                  model: Category,
                  as: 'category'
                },
                {
                  model: Tag,
                  as: 'tags',
                  through: ProductTag
                }]
    })
    if (!allProducts) {
      res.status(404).json({ message: "There are no products at the moment."})
    }
    res.status(200).json(allProducts)
  } catch (error) {
    console.log(error)
    res.status(500).json({error: "Sorry we couldn't get all product information at this time. Please try again later."})
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, { 
      include: [{
        model: Category,
        as: 'category'
      },
      {
        model: Tag,
        as: 'tags',
      }]
    });
    if (!product) {
      res.status(404).json({error: "No product found with this id"})
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Sorry, we couldn't get your product information at this time"})
  }
});

// create new product
router.post('/', async (req, res) => {
  try {
    const {product_name, price, stock, tagIds} = req.body
    if (!product_name || !price || !stock) {
      res.status(400).json({message: "Required key value pair missing. Ensure to include: product name, price and stock information in your request."})
    }

    newProduct = await Product.create({
      product_name,
      price,
      stock,
    })

    if (tagIds.length) {
      try {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: newProduct.id,
            tag_id,
          };
        });
        await ProductTag.bulkCreate(productTagIdArr);
        res.status(200).json({
          message: "Your product has been successfully created", 
          product: newProduct
        })
      } catch (error) {
        res.status(500).json("Sorry, we were unable to add your product tags. Please try again later")
      }
    }
    res.status(200).json({
      message: "Your product has been successfully created", 
      product: newProduct
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({error: "Sorry, we couldn't create your product at this time."})
  }
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
});

module.exports = router;