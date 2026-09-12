import Comment from "../models/comment.js";

// ===========================
// ADD COMMENT
// ===========================
export const addComment = async (req, res) => {
  try {
    const {
      userid,
      videoid,
      commentbody,
      usercommented,
      city,
      language,
    } = req.body;

    // Check required fields
    if (!userid || !videoid || !usercommented) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    // Check empty comment
    if (!commentbody || !commentbody.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    // Allow letters, numbers, spaces and common punctuation
    const validRegex = /^[A-Za-z0-9\s.,!?'"()\-]+$/;

    if (!validRegex.test(commentbody.trim())) {
      return res.status(400).json({
        message: "Invalid characters in comment",
      });
    }

    const comment = await Comment.create({
      userid,
      videoid,
      commentbody: commentbody.trim(),
      usercommented,
      city: city || "Unknown",
      language: language || "en",
    });

    return res.status(201).json(comment);
  } catch (error) {
    console.error("Add comment error:", error);

    return res.status(500).json({
      message: "Failed to add comment",
    });
  }
};

// ===========================
// GET COMMENTS OF VIDEO
// ===========================
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      videoid: req.params.videoId,
    })
      .populate("userid", "name image")
      .sort({ createdAt: -1 });

    return res.status(200).json(comments);
  } catch (error) {
    console.error("Get comments error:", error);

    return res.status(500).json({
      message: "Failed to fetch comments",
    });
  }
};

// ===========================
// LIKE COMMENT
// ===========================
export const likeComment = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    const alreadyLiked = comment.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      // Unlike
      comment.likes = comment.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // Like
      comment.likes.push(userId);

      // Remove dislike
      comment.dislikes = comment.dislikes.filter(
        (id) => id.toString() !== userId
      );
    }

    await comment.save();

    return res.status(200).json(comment);
  } catch (error) {
    console.error("Like comment error:", error);

    return res.status(500).json({
      message: "Failed to like comment",
    });
  }
};

// ===========================
// DISLIKE COMMENT
// ===========================
export const dislikeComment = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    const alreadyDisliked = comment.dislikes.some(
      (id) => id.toString() === userId
    );

    if (alreadyDisliked) {
      // Remove dislike
      comment.dislikes = comment.dislikes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // Add dislike
      comment.dislikes.push(userId);

      // Remove like
      comment.likes = comment.likes.filter(
        (id) => id.toString() !== userId
      );
    }

    await comment.save();

    return res.status(200).json(comment);
  } catch (error) {
    console.error("Dislike comment error:", error);

    return res.status(500).json({
      message: "Failed to dislike comment",
    });
  }
};

// ===========================
// TRANSLATE COMMENT
// ===========================
export const translateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(
      req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    // Translation can be connected to an API later
    return res.status(200).json({
      original: comment.commentbody,
      translated: comment.commentbody,
      language: comment.language,
      message: "Translation service not connected yet",
    });
  } catch (error) {
    console.error("Translation error:", error);

    return res.status(500).json({
      message: "Failed to translate comment",
    });
  }
};