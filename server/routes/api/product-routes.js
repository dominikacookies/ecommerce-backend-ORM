const router = require('express').Router();
const { response } = require('express');
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const allProducts = await Product.findAll({
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

    if (tagIds && tagIds.length) {
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
router.put('/:id', async (req, res) => {
  try {
      // update product data
    await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    })

    if (req.body.tag_id) {
      try {
        const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
        const productTagsArray = productTags.map(({ tag_id }) => tag_id)
  
        const newProductTags = req.body.tag_id
          .filter((tag_id) => !productTagsArray.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });
    
        const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tag_id.includes(tag_id))
        .map(({ id }) => id);
    
        await ProductTag.destroy({ where: { id: productTagsToRemove } }),
        await ProductTag.bulkCreate(newProductTags),
        res.status(200).json({message: "Product has been successfully updated"})
      } catch (error) {
        console.log(error)
        res.status(500).json({error: "Sorry we couldn't update your product tags at this time."})
      }
    }
    
    res.status(200).json({message: "Product has been successfully updated"})

  } catch (error) {
    console.log(error)
    res.status(500).json({error: "Sorry we couldn't update your product at this time."})
  }
  

});

// delete one product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    await Product.destroy({
      where: { id : req.params.id}
    });

    res.status(200).json({
      message: "The category has been successfully deleted",
    })
  } catch (error) {
    res.status(500).json({
      message: "We were unable to delete the product at this time. Please try again later."
    }) 
  }
});

module.exports = router;