export const sleepAndLog = (ms, message) => {
  console.log(`-> ${message}`);

  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
