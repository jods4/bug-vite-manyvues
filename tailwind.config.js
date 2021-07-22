const plugin = require("tailwindcss/plugin");
const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: {
    content: ["./{Components,Modules}/**/*.{ts,vue}", "./app.vue"],
    safelist: [
      "card-info",
      "card-success",
      "card-warn",
      "card-error", // from System/notify.ts
      "dialog-info",
      "dialog-error", // from Dialogs/index.ts
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#000",
      white: "#fff",
      accent: colors.sky,
      gray: colors.warmGray,
      red: colors.red,
      orange: colors.orange,
      yellow: colors.amber,
      green: {
        50: "#e8fcea",
        100: "#d2f9d6",
        200: "#a4f4ac",
        300: "#77ee83",
        400: "#49e95a",
        500: "#1ce330",
        600: "#16b627",
        700: "#11881d",
        800: "#0b5b13",
        900: "#062d0a",
      },
      blue: colors.blue,
    },

    fontFamily: {
      sans: ["Segoe UI, system-ui, sans-serif"],
      serif: ["serif"],
      mono: ["Consolas", "monospace"],
    },

    extend: {
      minWidth: {
        16: "4rem",
        32: "8rem",
        40: "10rem",
      },

      spacing: {
        83: "20.75rem",
      },
    },
  },

  plugins: [
    // `child:` variant, applies style to direct children
    plugin(function ({ addVariant, e }) {
      addVariant("child", ({ modifySelectors, separator }) => {
        modifySelectors(
          ({ className }) => `.${e("child" + separator + className)} > *`,
        );
      });
    }),
  ],
};
