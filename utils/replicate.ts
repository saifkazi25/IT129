const replicate = require("node-fetch-replicate")({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default replicate;
