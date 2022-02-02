export const parseLocationURL = () => {
  // eslint-disable-next-line no-restricted-globals
  const url = location.hash.slice(1).toLowerCase() || '/';
  const splitUrl = url.split('/');
  return {
    resource: splitUrl[1],
    id: splitUrl[2],
    verb: splitUrl[3],
  };
};
