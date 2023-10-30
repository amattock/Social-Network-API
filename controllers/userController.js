const { user } = require("../models");

const userController = {
  
  createuser({ body }, res) {
    user.create(body)
      .then((dbuserData) => res.json(dbuserData))
      .catch((err) => res.status(400).json(err));
  },

  getAlluser(req, res) {
      user.find()
        .select('-__v')
        .then((dbUserData) => {
          res.json(dbUserData);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    },

  getuserById({ params }, res) {
    user.findOne({ _id: params.id })
      .populate({ path: "thoughts", select: "-__v" })
      .populate({ path: "friends", select: "-__v" })
      .select("-__v")
      .then((dbuserData) => {
        if (!dbuserData) {
          res.status(404).json({ message: "No User with this particular ID!" });
          return;
        }
        res.json(dbuserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  updateuser({ params, body }, res) {
    user.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbuserData) => {
        if (!dbuserData) {
          res.status(404).json({ message: "No User with this particular ID!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  deleteuser({ params }, res) {
    user.findOneAndDelete({ _id: params.id })
      .then((dbuserData) => {
        if (!dbuserData) {
          res.status(404).json({ message: "No User with this particular ID!" });
          return;
        }
        res.json(dbuserData);
      })
      .catch((err) => res.status(400).json(err));
  },

  addFriend({ params }, res) {
    user.findOneAndUpdate(
      { _id: params.id },
      { $push: { friends: params.friendId } },
      { new: true }
    )
      .populate({ path: "friends", select: "-__v" })
      .select("-__v")
      .then((dbuserData) => {
        if (!dbuserData) {
          res.status(404).json({ message: "No User with this particular ID!" });
          return;
        }
        res.json(dbuserData);
      })
      .catch((err) => res.status(400).json(err));
  },

  deleteFriend({ params }, res) {
    user.findOneAndUpdate(
      { _id: params.id },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .populate({ path: "friends", select: "-__v" })
      .select("-__v")
      .then((dbuserData) => {
        if (!dbuserData) {
          res.status(404).json({ message: "No User with this particular ID!" });
          return;
        }
        res.json(dbuserData);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = userController;
