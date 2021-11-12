//Helper function getUserByEmail
const getUserByEmail = function(email, database) {
  const values = Object.values(database);

  for (const user of values) {
    if(user.email === email) {
      return user;
    }
  }
      return null;
}

module.exports = { getUserByEmail };