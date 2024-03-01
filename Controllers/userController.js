const registerNewUser = async (req, res) => {
  res.send("register");
};

const loginUser = (req, res) => {
  res.send("login");
};

module.exports = { registerNewUser, loginUser };
