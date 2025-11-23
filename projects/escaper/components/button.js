import { isNil } from '../utils/helpers.js';

/**
 * @param {Object} [props]
 * @param {string} [props.className]
 * @param {string} [props.text]
 * @param {string} [props.title]
 * @param {string} [props.id]
 * @param {function} [props.onClick]
 * @returns {HTMLButtonElement}
 * */
export default props => {
  const button = document.createElement('button');
  if (!props) return button;
  if (props.className)
    button.classList.add(...props.className.split(' ').filter(Boolean));
  if (!isNil(props.text)) button.innerHTML = props.text;
  if (!isNil(props.title)) button.title = props.title;
  if (props.id) button.id = props.id;
  if (props.onClick) button.addEventListener('click', props.onClick);

  return button;
};
