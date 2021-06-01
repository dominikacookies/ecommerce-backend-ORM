// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
});

// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {
  through: {
    model: ProductTag,
  },
  onDelete: "cascade",
  onUpdate: "cascade",
});

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {
  through: {
    model: ProductTag,
  },
  onDelete: "cascade",
  onUpdate: "cascade",
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
