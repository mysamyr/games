//{
//   lvl: number;
//   id?: string;
//   text?: string;
//   className?: string;
// }
/**
 * @param {Object} [props]
 * @param {number} [props.lvl]
 * @param {string} [props.className]
 * @param {string} [props.text]
 * @param {string} [props.id]
 * @returns {HTMLHeadingElement}
 * */
export default props => {
  const h = document.createElement(`h${props.lvl || 1}`);
  if (props.className) {
    h.classList.add(...props.className.split(' ').filter(Boolean));
  }
  if (props.text) h.innerHTML = props.text;
  if (props.id) h.id = props.id;

  return h;
};
