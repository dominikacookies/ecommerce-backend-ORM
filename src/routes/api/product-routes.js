const router = require("express").Router();

const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// get all products
router.get("/", async (req, res) => {
  try {
    const allProducts = await Product.findAll({
      include: [
        {
          model: Category,
          as: "category",
        },
        {
          model: Tag,
          as: "tags",
          through: ProductTag,
        },
      ],
    });

    if (!allProducts.length) {
      return res.status(404).json({
        error: "No products found",
      });
    }

    return res.status(200).json(allProducts);
  } catch (error) {
    res.status(500).json({
      error:
        "Sorry we couldn't get all product information at this time. Please try again later.",
    });
  }
});

// get one product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: "category",
        },
        {
          model: Tag,
          as: "tags",
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        error: "No product found with this id",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({
      error: "Sorry, we couldn't get your product information at this time",
    });
  }
});

// create new product
router.post("/", async (req, res) => {
  try {
    const { product_name, price, stock, tagIds } = req.body;

    if (!product_name || !price || !stock) {
      return res.status(400).json({
        error: "Values undefined",
        message: "Please provide a product name, price and stock information.",
      });
    }

    const newProduct = await Product.create({
      product_name,
      price,
      stock,
    });

    if (tagIds && tagIds.length) {
      try {
        const productTagIdArr = req.body.tagIds.map((tag_id) => ({
          product_id: newProduct.id,
          tag_id,
        }));

        await ProductTag.bulkCreate(productTagIdArr);

        return res.status(200).json(newProduct);
      } catch (error) {
        return res.status(500).json({
          error:
            "Sorry, we were unable to add your product tags. Please try again later",
        });
      }
    }

    return res.status(200).json({
      message: "Your product has been successfully created",
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Sorry, we couldn't create your product at this time.",
    });
  }
});

// update product
router.put("/:id", async (req, res) => {
  try {
    // update product data
    const updateResult = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (updateResult[0] === 0) {
      return res.status(404).json({
        error: "Product doesn't exist",
      });
    }

    if (req.body.tag_id) {
      try {
        const productTags = await ProductTag.findAll({
          where: { product_id: req.params.id },
        });

        const productTagsArray = productTags.map(({ tag_id }) => tag_id);

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

        await ProductTag.destroy({ where: { id: productTagsToRemove } });
        await ProductTag.bulkCreate(newProductTags);

        return res.status(200).json({
          message: "Product has been successfully updated",
        });
      } catch (error) {
        return res.status(500).json({
          error: "Sorry we couldn't update your product tags at this time.",
        });
      }
    }

    return res.status(200).json({
      message: "Product has been successfully updated",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Sorry we couldn't update your product at this time.",
    });
  }
});

// delete one product by its `id` value
router.delete("/:id", async (req, res) => {
  try {
    const deleteResult = await Product.destroy({
      where: { id: req.params.id },
    });

    if (!deleteResult) {
      return res.status(404).json({
        error: "Product doesn't exist",
      });
    }

    return res.status(200).json({
      message: "The product has been successfully deleted",
    });
  } catch (error) {
    return res.status(500).json({
      error:
        "We were unable to delete the product at this time. Please try again later.",
    });
  }
});

module.exports = router;
