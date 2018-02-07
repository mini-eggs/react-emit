import React from "react";

const NO_PROVIDER_ERROR = "No react-emit provider has been used.";

const ctx = React.createContext({
  on: () => console.error(NO_PROVIDER_ERROR),
  off: () => console.error(NO_PROVIDER_ERROR),
  emit: () => console.error(NO_PROVIDER_ERROR)
});

export default ctx;
