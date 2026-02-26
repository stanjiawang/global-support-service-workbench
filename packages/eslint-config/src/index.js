export default {
  root: true,
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        selector: "JSXOpeningElement[name.name='div'][attributes.0.name.name='onClick']",
        message: "Use accessible interactive elements instead of div with click handlers."
      }
    ]
  }
};
