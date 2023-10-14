/** @returns {Promise<import('jest').Config>} */
module.exports = async () => {
  return {
    setupFilesAfterEnv: ["./config.js"],
  };
};
