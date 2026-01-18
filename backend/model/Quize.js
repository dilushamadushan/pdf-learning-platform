import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      index: true,
    },

    questions: [
      {
        question: {
          type: String,
          required: true,
          trim: true,
        },

        options: {
          type: [String],
          required: true,
          validate: {
            validator: (arr) => arr.length === 4,
            message: "Must have exactly 4 options",
          },
        },

        correctAnswer: {
          type: String,
          required: true,
          validate: {
            validator: function (value) {
              return this.options.includes(value);
            },
            message: "Correct answer must be one of the options",
          },
        },

        explanation: {
          type: String,
          default: "",
          trim: true,
        },

        difficulty: {
          type: String,
          enum: ["easy", "medium", "hard"],
          default: "medium",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Quiz", quizSchema);
