export const startViewTransition = (cb: () => any) => {
  if ('startViewTransition' in document) return (document as any).startViewTransition(cb);
  cb();
}