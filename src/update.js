import "dotenv/config";

import { updateFaqEmbeddings } from "./utils.js";

updateFaqEmbeddings().then(() => {
  console.log("FAQ embeddings updated successfully.");
  process.exit(0);
});
