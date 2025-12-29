import React, { useEffect } from "react";

const ChatbaseBot = () => {
  useEffect(() => {
    // Initialize Chatbase
    if (!window.chatbase || window.chatbase("getState") !== "initialized") {
      window.chatbase = (...argument) => {
        if (!window.chatbase.q) {
          window.chatbase.q = [];
        }
        window.chatbase.q.push(argument);
      };

      window.chatbase = new Proxy(window.chatbase, {
        get(target, prop) {
          if (prop === "q") {
            return target.q;
          }
          return (...args) => target(prop, ...args);
        },
      });
    }

    // Create and append script
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "yqCF9pseGhAlibbQGcDyv";
    script.async = true;
    document.body.appendChild(script);

    // Cleanup on unmount
    return () => {
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return null;
};

export default ChatbaseBot;
