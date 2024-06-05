export default () => {
  if (process.env.NODE_ENV === "production") {
    return {
      ...commonProp,
    };
  } else {
    return {
      ...commonProp,
      // ios: {
      //   // googleServicesFile: "./GoogleService-Info-development.plist",
      //   supportsTablet: true,
      //   bundleIdentifier: "com.wgplaner",
      // },
      android: {
        googleServicesFile: "./google-services-development.json",
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: "#FFFFFF",
        },
        package: "com.wgplaner",
      },
      web: {
        favicon: "./assets/favicon.png",
        config: {
          // firebase: {
          //   apiKey: "AIzaSyDiF7SVsUuB5dK3kuXBI_5sI7XU8_iNuk8",
          //   authDomain: "wgplaner-a091e.firebaseapp.com",
          //   projectId: "wgplaner-a091e",
          //   storageBucket: "wgplaner-a091e.appspot.com",
          //   messagingSenderId: "594491784193",
          //   appId: "1:594491784193:web:0c68d523eead704e5fd400",
          //   measurementId: "G-B4NF2BQTRK",
          // },
        },
      },
    };
  }
};

const commonProp = {
  name: "wg-planer-mobile",
  slug: "wg-planer-mobile",
  scheme: "wg-planer-mobile",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  extra: {
    eas: {
      projectId: "0906c028-dba9-47cb-a52f-2707bfd063ef",
    },
  },
  plugins: [
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
        },
      },
    ],
    // "@react-native-firebase/app",
    // "@react-native-firebase/perf",
    // "@react-native-firebase/crashlytics",
    "expo-secure-store"
  ],
};
