module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["@babel/plugin-transform-runtime"],
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
      [
        "module-resolver",
        {
          root: ["./src/"],
          alias: {
            assets: "./assets",
            components: "./src/components",
            features: "./src/features",
            lib: "./src/lib",
            mocks: "./src/mocks",
            store: "./src/store",
            types: "./src/types",
            // util: "./src/util",
            App: "./src/App"
          },
        },
      ],
    ],
  };
};
