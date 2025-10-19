const { NlpManager, SentimentAnalyzer, LangAll } = require("node-nlp");

const manager = new NlpManager({ languages: ["en"] });
const sentiment = new SentimentAnalyzer({
  language: "en",
  nlu: manager.nluManager,
  useNeural: true,
});

async function analyzeSentiment(text) {
  const result = await sentiment.process({ locale: "en", text: text });
  return result;
}

module.exports = {
  analyzeSentiment,
};
