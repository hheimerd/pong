const { yearsToMonths } = require("date-fns");

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    BACKEND_HOST: process.env.BACKEND_HOST,
    HOST: process.env.HOST,
    GAME_API_HOST: process.env.GAME_API_HOST,
  },
};
