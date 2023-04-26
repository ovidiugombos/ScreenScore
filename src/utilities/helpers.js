export const getData = function (url) {
  try {
    return fetch(url)
      .then((data) => data.json())
      .then((res) => {
        return res;
      });
  } catch (error) {
    console.log(error);
  }
};
