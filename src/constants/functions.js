export const addEvent = (key, handle) => ({ events }) => {
  const nextEvents = { ...events };

  const currentHandles = events[key] || [];
  nextEvents[key] = [...currentHandles, handle];

  return { events: nextEvents };
};

export const removeEvent = (key, handle) => ({ events }) => {
  const nextEvents = {};

  for (const currentKey in events) {
    if (currentKey === key) {
      const nextHandles = [];

      for (const currentHandle of events[currentKey]) {
        if (currentHandle !== handle) {
          nextHandles.push(currentHandle);
        }
      }

      nextEvents[currentKey] = nextHandles;
    }
  }

  return { events: nextEvents };
};

export const callEvent = (handlers = []) => ({ detail }) => {
  for (const handle of handlers) {
    handle(detail);
  }
};
