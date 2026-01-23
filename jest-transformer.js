import tsJest from 'ts-jest';

export default {
  process(src, filename, config, options) {
    // Replace import.meta.env.DEV with process.env.NODE_ENV === 'development'
    const transformedSrc = src.replaceAll(
      'import.meta.env.DEV',
      "process.env.NODE_ENV === 'development'",
    );
    
    // Also replace import.meta.env with a mock object
    const finalSrc = transformedSrc.replaceAll(
      'import.meta.env',
      "{ DEV: process.env.NODE_ENV === 'development' }",
    );

    return tsJest.default.process(finalSrc, filename, config, options);
  },
};
