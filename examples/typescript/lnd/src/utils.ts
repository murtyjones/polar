export const forever = async (fn: () => Promise<void>) => {
  while (true) {
    await fn();
  }
};
