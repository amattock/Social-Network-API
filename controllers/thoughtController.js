const { thought, user } = require("../models");

const thoughtController = {
  getThought(req, res) {
    thought.find({})
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  getThought(req, res) {
    thought.findOne({ _id: req.params.thoughtId })
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: "No thought with this ID" });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  createThought(req, res) {
    thought.create(req.body)
      .then((dbThoughtData) => {
        return user.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thought: dbThoughtData._id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "Thought created, however no ID" });
        }
        res.json({ message: "Thought created" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  updateThought(req, res) {
    thought.findOneAndUpdate({ _id: req.params.thoughtId }, req.body, {
        runValidators: true,
        new: true,
      })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: "No thought with this ID" });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },


deleteThought(req, res) { 
  thought.findOneAndRemove({ _id: req.params.thoughtId })
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        return res.status(404).json({ message: "No thought with this ID!" });
      }

      return user.findOneAndUpdate(
        { thought: req.params.thoughtId },
        { $pull: { thought: req.params.thoughtId } },
        { new: true }
      );
    })
    .then((dbUserData) => {
      if (!dbUserData) {
        return res.status(404).json({ message: "Thought created but no ID!" });
      }
      res.json({ message: "Thought deleted" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
},

addReaction(req, res) {
  thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $addToSet: { reactions: req.body } },
    { runValidators: true, new: true }
  )
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        return res.status(404).json({ message: "No thought with this ID" });
      }
      res.json(dbThoughtData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
},

removeReaction(req, res) {
  thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $pull: { reactions: { reactionId: req.params.reactionId } } },
    { runValidators: true, new: true }
  )
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        return res.status(404).json({ message: "No thought with this ID" });
      }
      res.json({ message: "Reaction deleted" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
},
};

module.exports = thoughtController;
