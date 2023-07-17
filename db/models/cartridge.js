/* eslint-disable no-unused-vars */
import { Model, DataTypes } from 'sequelize';
import connection from '../connection';

const initCartridge = (sequelize, Types) => {
  class Cartridge extends Model {}
  Cartridge.init(
    {
      user_id: Types.INTEGER,
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      totalMinutes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      maxHours: {
        type: DataTypes.INTEGER,
        defaultValue: 1000,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'Cartridge',
      tableName: 'cartridges',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Cartridge;
};

export default initCartridge(connection, DataTypes);
