import User from './user';
import Cartridge from './cartridge';
import Album from './album';

User.hasMany(Cartridge, {
  foreignKey: 'user_id',
  sourceKey: 'id',
  as: 'cartridges',
  onDelete: 'CASCADE',
  hooks: true,
});

Cartridge.belongsTo(User, {
  foreignKey: 'id',
  sourceKey: 'user_id',
  as: 'users',
  through: 'CartridgeUsers',
  hooks: true,
});

User.hasMany(Album, {
  foreignKey: 'user_id',
  sourceKey: 'id',
  as: 'albums',
  onDelete: 'CASCADE',
  hooks: true,
});

Album.belongsTo(User, {
  foreignKey: 'id',
  sourceKey: 'user_id',
  as: 'user',
  hooks: true,
});

Album.hasOne(Cartridge, {
  foreignKey: 'id',
  sourceKey: 'cartridge_id',
  as: 'albumCartridge',
  hooks: true,
  onDelete: 'SET NULL',
});

Cartridge.belongsTo(Album, {
  foreignKey: 'id',
  sourceKey: 'cartridge_id',
  as: 'cartridgeAlbum',
  hooks: true,
});

export { User, Cartridge, Album };
