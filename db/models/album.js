/* eslint-disable no-unused-vars */
import { Model, DataTypes } from 'sequelize';
import connection from '../connection';

const initAlbum = (sequelize, Types) => {
  class Album extends Model {}
  Album.init(
    {
      user_id: Types.INTEGER,
      cartridge_id: Types.INTEGER,
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      artist: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      albumId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      masterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      minutesPlayed: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Album',
      tableName: 'albums',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Album;
};

export default initAlbum(connection, DataTypes);
