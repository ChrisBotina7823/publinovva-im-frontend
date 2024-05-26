// ConfiguratorContext.js
import React, { useState } from 'react';

const ConfiguratorContext = React.createContext();

export function ConfiguratorProvider({ children }) {
  const [customContent, setCustomContent] = useState(null);
  const [customTitle, setCustomTitle] = useState(null);
  const [customDescription, setCustomDescription] = useState(null);

  return (
    <ConfiguratorContext.Provider value={{ customContent, setCustomContent, customTitle, setCustomTitle, customDescription, setCustomDescription }}>
      {children}
    </ConfiguratorContext.Provider>
  );
}

export default ConfiguratorContext;