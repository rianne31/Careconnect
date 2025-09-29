module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Keep minimal while resolving bundling errors
  };
};


