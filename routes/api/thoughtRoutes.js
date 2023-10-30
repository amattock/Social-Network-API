const router = require("express").Router();

const {
  getThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require("../../controllers/thoughtController");

router.route("/").get(getThought).post(createThought);
router.route("/:id").get(getThought).put(updateThought).delete(deleteThought);
router.route("/:thoughtid/reactions").post(addReaction);
router.route("/:thoughtid/reactions/:reactionid").delete(removeReaction);

module.exports = router;
