import { isNil } from '../utils/helpers.js';

/**
 * @param {object} [props]
 * @param {string} [props.className]
 * @param {string} [props.text]
 * @param {string} [props.id]
 * @returns {HTMLParagraphElement}
 * */
export default props => {
  const p = document.createElement('p');
  if (!props) return p;
  if (props.className)
    p.classList.add(...props.className.split(' ').filter(Boolean));
  if (!isNil(props.text)) p.innerHTML = props.text;
  if (props.id) p.id = props.id;

  return p;
};
