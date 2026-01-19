import Quize from "../model/Quize.js";

export const getAllQuizzes = async (req, res) => {
  try {
    const { id } = req.params;

    const filter = {};
    if (id) {
      filter.documentId = id;
    }

    const quizzes = await Quize.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });

  } catch (error) {
    console.error("Get quizzes error:", error);
    res.status(500).json({ message: "Failed to fetch quizzes" });
  }
};
