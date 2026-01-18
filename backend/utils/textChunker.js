/**
 * Split text into chunks for better AI processing
 * (used for embeddings, search, RAG, etc.)
 *
 * @param {string} text - Full document text
 * @param {number} chunkSize - Max words per chunk
 * @param {number} overlap - Number of overlapping words between chunks
 * @returns {Array<{content: string, chunkIndex: number, pageNumber: number}>}
 */

export const chunkText = (text, chunkSize = 500, overlap = 50) => {
  // If text is empty or invalid → return empty array
  if (!text || text.trim().length === 0) return [];

  /* --------------------------------------------------
     STEP 1: Clean the input text
     -------------------------------------------------- */

  const cleanedText = text
    .replace(/\r\n/g, "\n")   // Normalize Windows line endings
    .replace(/\s+/g, " ")     // Collapse multiple spaces
    .replace(/\n /g, "\n")    // Remove space after newline
    .replace(/ \n/g, "\n")    // Remove space before newline
    .trim();                  // Remove leading/trailing spaces

  /* --------------------------------------------------
     STEP 2: Split text into paragraphs
     -------------------------------------------------- */

  const paragraphs = cleanedText
    .split(/\n+/)             // Split on one or more newlines
    .filter(p => p.trim().length > 0); // Remove empty paragraphs

  /* --------------------------------------------------
     STEP 3: Prepare variables for chunking
     -------------------------------------------------- */

  const chunks = [];          // Final result
  let currentChunk = [];      // Paragraphs inside current chunk
  let currentWordCount = 0;   // Word count of current chunk
  let chunkIndex = 0;         // Index for each chunk

  /* --------------------------------------------------
     STEP 4: Loop through each paragraph
     -------------------------------------------------- */

  for (const paragraph of paragraphs) {
    const words = paragraph.trim().split(/\s+/); // Words in paragraph
    const wordCount = words.length;

    /* --------------------------------------------------
       CASE 1: Paragraph is bigger than chunkSize
       → Split paragraph directly
       -------------------------------------------------- */

    if (wordCount > chunkSize) {
      // Save any existing chunk first
      if (currentChunk.length > 0) {
        chunks.push({
          content: currentChunk.join("\n\n"),
          chunkIndex: chunkIndex++,
          pageNumber: 0,
        });
        currentChunk = [];
        currentWordCount = 0;
      }

      // Split long paragraph into overlapping chunks
      for (let i = 0; i < words.length; i += chunkSize - overlap) {
        const chunkWords = words.slice(i, i + chunkSize);

        chunks.push({
          content: chunkWords.join(" "),
          chunkIndex: chunkIndex++,
          pageNumber: 0,
        });

        // Stop when end of paragraph reached
        if (i + chunkSize >= words.length) break;
      }
      continue;
    }

    /* --------------------------------------------------
       CASE 2: Adding paragraph exceeds chunkSize
       → Close current chunk and start new one
       -------------------------------------------------- */

    if (currentWordCount + wordCount > chunkSize && currentChunk.length > 0) {
      // Save current chunk
      chunks.push({
        content: currentChunk.join("\n\n"),
        chunkIndex: chunkIndex++,
        pageNumber: 0,
      });

      // Create overlap from previous chunk
      const prevWords = currentChunk.join(" ").split(/\s+/);
      const overlapText = prevWords
        .slice(-Math.min(overlap, prevWords.length))
        .join(" ");

      // Start new chunk with overlap + new paragraph
      currentChunk = [overlapText, paragraph.trim()];
      currentWordCount =
        overlapText.split(/\s+/).length + wordCount;
    } else {
      // Paragraph fits → add to current chunk
      currentChunk.push(paragraph.trim());
      currentWordCount += wordCount;
    }
  }

  /* --------------------------------------------------
     STEP 5: Push remaining chunk
     -------------------------------------------------- */

  if (currentChunk.length > 0) {
    chunks.push({
      content: currentChunk.join("\n\n"),
      chunkIndex,
      pageNumber: 0,
    });
  }

  return chunks;
};

/**
 * Find relevant chunks using keyword scoring
 *
 * @param {Array<Object>} chunks - All text chunks
 * @param {string} query - User question
 * @param {number} maxChunks - Max results to return
 * @returns {Array<Object>}
 */

export const findRelevantChunks = (chunks, query, maxChunks = 5) => {
  // Guard conditions
  if (!chunks?.length || !query) return [];

  /* --------------------------------------------------
     STEP 1: Stop words (ignored in search)
     -------------------------------------------------- */

  const stopWords = new Set([
    "the", "is", "at", "which", "on", "a", "an", "or", "but",
    "in", "with", "to", "for", "of", "as", "by", "this", "that", "it",
  ]);

  /* --------------------------------------------------
     STEP 2: Clean query into keywords
     -------------------------------------------------- */

  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  // If query has no useful keywords → return first chunks
  if (queryWords.length === 0) {
    return chunks.slice(0, maxChunks);
  }

  /* --------------------------------------------------
     STEP 3: Score each chunk
     -------------------------------------------------- */

  const scoredChunks = chunks.map((chunk, index) => {
    const content = (chunk.content ?? chunk.contents ?? '').toLowerCase();
    const contentWordCount = content.split(/\s+/).length;

    let score = 0;
    let matchedWords = 0;

    // Score based on keyword matches
    for (const word of queryWords) {
      const exactMatches =
        (content.match(new RegExp(`\\b${word}\\b`, "g")) || []).length;

      const partialMatches =
        (content.match(new RegExp(word, "g")) || []).length;

      if (exactMatches > 0) matchedWords++;

      // Exact matches are more valuable
      score += exactMatches * 3;

      // Partial matches are weaker
      score += Math.max(0, partialMatches - exactMatches) * 1.5;
    }

    // Bonus if multiple keywords match
    if (matchedWords > 1) score += matchedWords * 2;

    // Normalize score by content length
    const normalizedScore = score / Math.sqrt(contentWordCount);

    // Slight bonus for earlier chunks
    const positionBonus = 1 - index / chunks.length;

    return {
      ...chunk.toObject(),
      score: normalizedScore * positionBonus,
      matchedWords,
    };
  });

  /* --------------------------------------------------
     STEP 4: Sort & return top results
     -------------------------------------------------- */

  return scoredChunks
    .filter(c => c.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.matchedWords !== a.matchedWords)
        return b.matchedWords - a.matchedWords;
      return a.chunkIndex - b.chunkIndex;
    })
    .slice(0, maxChunks);
};
