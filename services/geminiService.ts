
const quotes: string[] = [
  "The secret of getting ahead is getting started.",
  "A budget is telling your money where to go, instead of wondering where it went.",
  "Do not save what is left after spending, but spend what is left after saving.",
  "Financial discipline is the bridge between goals and accomplishment.",
  "Your financial health is more important than the opinion of others.",
  "Save money and money will save you.",
  "Small savings add up to a large sum over time."
];

export const getMotivationalQuote = async (): Promise<string> => {
  // This function now returns a random quote from a local array,
  // allowing it to work offline without needing an API key.
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return Promise.resolve(quotes[randomIndex]);
};
