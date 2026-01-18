import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    fileName: {
        type: String,
        default: ""
    },
    filePath: {
        type: String,
        default: ""
    },
    extractedText: {
        type: String,
        default: ""
    },
    chunks: [
        {
            content: {
                type: String,
                required: true
            },
            pageNumber: {
                type: Number,
                default: 0
            },
            chunkIndex: {
                type: Number,
                required: true
            }
        }
    ]
}, { timestamps: true });

const Document = mongoose.model("Document", documentSchema);

export default Document;
