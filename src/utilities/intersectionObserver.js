//OBSERVER IMPLEMENTATION
const options = {
  root: null,
  threshold: 0.1,
};
const callback = function (entries, observer) {
  entries.forEach((entry) => {
    const { target } = entry;
    if (entry.isIntersecting) {
      target.style.opacity = 1;
      target.classList.remove("hide");
    } else {
      target.style.opacity = 0;
      target.classList.add("hide");
    }
  });
};
export const observer = new IntersectionObserver(callback, options);
