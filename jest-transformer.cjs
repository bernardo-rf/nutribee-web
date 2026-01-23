const { createTransformer } = require('ts-jest').default;

const transformer = createTransformer();

module.exports = {
  process(src, filename, config, options) {
    const transformedSrc = src.replaceAll(
      'import.meta.env.DEV',
      "process.env.NODE_ENV === 'development'",
    );
    
    const finalSrc = transformedSrc.replaceAll(
      'import.meta.env',
      "{ DEV: process.env.NODE_ENV === 'development' }",
    );

    return transformer.process(finalSrc, filename, config, options);
  },
  getCacheKey(src, filename, config, options) {
    return transformer.getCacheKey(src, filename, config, options);
  },
};
