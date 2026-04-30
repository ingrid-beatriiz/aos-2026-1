const getRefreshTokenModel = (sequelize, { DataTypes }) => {
  const RefreshToken = sequelize.define("refreshToken", {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  RefreshToken.associate = (models) => {

    RefreshToken.belongsTo(models.User);
  };

  RefreshToken.verifyExpiration = (token) => {
    return token.expiryDate.getTime() < new Date().getTime();
  };

  return RefreshToken;
};

export default getRefreshTokenModel;