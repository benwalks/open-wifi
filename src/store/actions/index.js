export const addHotspot = hotspot => {
  return {
    type: 'ADD_HOTSPOT',
    hotspot,
  };
};

export const removeFlash = () => {
  return {
    type: 'REMOVE_FLASH',
  };
};

export const restoreFlash = () => {
  return {
    type: 'RESTORE_FLASH',
  };
};
