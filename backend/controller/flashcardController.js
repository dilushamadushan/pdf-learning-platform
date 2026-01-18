import Flashcard from "../model/Flashcard.js";


export const getAllFlashcards = async (req, res) => {
  try {
    const { documentId } = req.query;

    const filter = {};
    if (documentId) {
      filter.documentId = documentId;
    }

    const flashcards = await Flashcard.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flashcards.length,
      data: flashcards,
    });

  } catch (error) {
    console.error("Get flashcards error:", error);
    res.status(500).json({ message: "Failed to fetch flashcards" });
  }
};

export const deleteFlashcard = async (req, res) => {
  try {
    const { id } = req.params;

    const flashcard = await Flashcard.findById(id);
    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard not found" });
    }

    await flashcard.deleteOne();

    res.status(200).json({
      success: true,
      message: "Flashcard deleted successfully",
    });

  } catch (error) {
    console.error("Delete flashcard error:", error);
    res.status(500).json({ message: "Failed to delete flashcard" });
  }
};
