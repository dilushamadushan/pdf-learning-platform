import Summary from "../model/Summary.js";

export const getAllSummaries = async (req, res, next) => {
  try {
    const { documentId } = req.query;

    const filter = documentId ? { documentId } : {};

    const summaries = await Summary.find(filter)
      .populate("documentId", "fileName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: summaries,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSummary = async (req, res, next) => {
  try {
    const { id } = req.params;

    const summary = await Summary.findByIdAndDelete(id);
    if (!summary) {
      return res.status(404).json({ message: "Summary not found" });
    }

    res.status(200).json({
      success: true,
      message: "Summary deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
