const {thoughts, users} = require('../models');
const thoughtsController = {

    // Get multiple thoughts
  getThoughts(req, res) {
    Thought.find({})
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

  // Get a single thought
  getThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
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

  // Create a thought
    createThought(req, res) {
        thoughts
            .create(req.body)
            .then((dbThoughtData) => {
                return users.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $push: { thoughts: dbThoughtData._id } },
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

    // Update thought
    updateThought(req, res) {
        thoughts.findOneAndUpdate({ _id: req.params.thoughtId }, req.body, {
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
};

  // Delete a thought
deleteThought(req, res); {
    thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: "No thought with this id!" });
        }

        return User.findOneAndUpdate(
          { thoughts: req.params.thoughtId },
          { $pull: { thoughts: req.params.thoughtId } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "Thought created but no ID!" });
        }
        res.json({ message: "Thought deleted" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  };

  // Add a reaction to a thought
  addReaction(req, res); {
    Thought.findOneAndUpdate(
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
  };

  // Remove reaction from a thought
  removeReaction(req, res); {
    Thought.findOneAndUpdate(
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
  };


module.exports = thoughtController;