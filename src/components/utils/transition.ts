export const startViewTransition = (cb: () => any) => {
  if ('startViewTransition' in document) {
    return (document as any).startViewTransition(async() => {
      await cb();
      await new Promise((res) => setTimeout(res, 0)); // Replace with syncFlush or something like that
    });
  } else {
    cb();
  }
}