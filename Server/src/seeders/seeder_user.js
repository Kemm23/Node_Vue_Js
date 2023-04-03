'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      name: 'Kem',
      email: 'kem@gmail.com',
      password: '123456',
      phone_number: '0313123',
      address: 'HN',
      role_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete('Users', null, {});
  }
};
