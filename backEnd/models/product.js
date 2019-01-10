module.exports = function (sequelize, dataType) {
    const Product = sequelize.define('product', {
        productName: {
            type: dataType.STRING,
            allowNull: false,
        },
        imagePath: {
            type: dataType.STRING,
            allowNull: false
        },
        productPrice: {
            type: dataType.INTEGER,
            allowNull: false
        },
    }, {
        underscored: true
    });
    return Product;
};
