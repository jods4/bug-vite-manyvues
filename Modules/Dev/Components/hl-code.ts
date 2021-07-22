import hljs from "highlight.js/lib/core";
import js from "highlight.js/lib/languages/javascript";
import html from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";
import "highlight.js/styles/base16/material-palenight.css";
import "./hl-code.css";

hljs.registerLanguage("js", js);
hljs.registerLanguage("html", html);
hljs.registerLanguage("yaml", yaml);

export default {
  mounted(el: HTMLElement) {
    hljs.highlightElement(el);
  },
};
