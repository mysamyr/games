import { isNil } from '../utils/helpers.js';

/**
 * @param {object} [props]
 * @param {string} [props.className]
 * @param {string} [props.text]
 * @param {string} [props.id]
 * @param {object} [props.style]
 * @param {function} [props.onClick]
 * @param {HTMLElement[]} [props.children]
 * @returns {HTMLDivElement}
 * */
export default props => {
  const div = document.createElement('div');
  if (!props) return div;
  if (props.className)
    div.classList.add(...props.className.split(' ').filter(Boolean));
  if (!isNil(props.text)) div.innerHTML = props.text;
  if (props.id) div.id = props.id;
  if (props.style)
    Object.entries(props.style).forEach(
      ([key, value]) => (div.style[key] = value)
    );
  if (props.onClick) div.addEventListener('click', props.onClick);
  if (props.children && Array.isArray(props.children))
    div.append(...props.children);

  return div;
};
