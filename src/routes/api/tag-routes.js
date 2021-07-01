const router = require("express").Router();

const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

// find all tags
router.get("/", async (req, res) => {
  try {
    const allTags = await Tag.findAll({
      include: [
        {
          model: Product,
          as: "products",
          through: ProductTag,
        },
      ],
    });

    if (!allTags.length) {
      return res.status(404).json({
        error: "There are no tags at the moment.",
      });
    }

    return res.status(200).json(allTags);
  } catch (error) {
    return res.status(500).json({
      error:
        "Sorry we couldn't get all tag information at this time. Please try again later.",
    });
  }
});

// find a single tag by its `id`
router.get("/:id", async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          as: "products",
        },
      ],
    });

    if (!tag) {
      res.status(404).json({ error: "No tag found with this id" });
    }

    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({
      error: "Sorry, we couldn't get your tag information at this time",
    });
  }
});

// create a new tag
router.post("/", async (req, res) => {
  try {
    const { tag_name } = req.body;

    if (!tag_name) {
      return res.status(400).json({
        error: "Values undefined",
        message: "Please provide a tag name.",
      });
    }

    const newTag = await Tag.create({ tag_name });

    return res.status(200).json(newTag);
  } catch (error) {
    return res.status(500).json({
      error:
        "Sorry, we were unable to create a new tag at this time. Please try again later.",
    });
  }
});

// update a tag's name by its `id` value
router.put("/:id", async (req, res) => {
  try {
    const { tag_name } = req.body;

    if (!tag_name) {
      return res.status(400).json({
        error: "Values undefined",
        message: "Please provide a tag name.",
      });
    }

    const updateResult = await Tag.update(
      { tag_name },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (updateResult[0] === 0) {
      return res.status(404).json({
        error: "Tag doesn't exist",
      });
    }

    return res.status(200).json({
      message: "successfully updated tag",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Sorry, we couldn't update your tag at this time",
    });
  }
});

// delete on tag by its `id` value
router.delete("/:id", async (req, res) => {
  try {
    const deleteResult = await Tag.destroy({
      where: { id: req.params.id },
    });

    if (!deleteResult) {
      return res.status(404).json({
        error: "Tag doesn't exist",
      });
    }

    return res.status(200).json({
      message: "The tag has been successfully deleted",
    });
  } catch (error) {
    return res.status(500).json({
      error:
        "We were unable to delete the tag at this time. Please try again later.",
    });
  }
});

module.exports = router;
