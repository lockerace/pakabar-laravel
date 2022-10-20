const csrfMeta = document.querySelector('meta[name="csrf-token"]')
export default () => {
  return csrfMeta.content
};
