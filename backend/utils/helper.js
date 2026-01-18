const normalizeCorrectAnswer = (correctAnswer, options) => {
  if (!correctAnswer || !options?.length) return options[0];

  const match = correctAnswer.match(/Q([1-4])/i);
  if (match) {
    const index = Number(match[1]) - 1;
    return options[index] ?? options[0];
  }

  const directMatch = options.find(
    (opt) => opt.toLowerCase() === correctAnswer.toLowerCase()
  );

  return directMatch || options[0];
};


export default normalizeCorrectAnswer;