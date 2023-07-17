'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          username: 'WarpedWing',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          username: 'TestUser2',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );

    await queryInterface.bulkInsert(
      'cartridges',
      [
        {
          user_id: 1,
          name: 'Denon DL-110',
          totalMinutes: 3300,
          maxHours: 1000,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 2,
          name: 'Shure V-15',
          totalMinutes: 13500,
          maxHours: 1500,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
    await queryInterface.bulkInsert(
      'albums',
      [
        {
          user_id: 1,
          cartridge_id: 1,
          title: 'Album Title',
          artist: 'Album Artist',
          albumId: 1,
          masterId: 2,
          minutesPlayed: 40,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('cartridges', null, {});
    await queryInterface.bulkDelete('albums', null, {});
  },
};
