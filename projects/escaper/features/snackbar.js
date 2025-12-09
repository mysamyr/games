import { Div } from '../components/index.js';

class Snackbar {
  constructor() {
    this.timer = null;
    this.component = null;
    this.messages = [];
    this.TIME_TO_HIDE = 3 * 1000;
  }

  _startTimer() {
    this.timer = setTimeout(() => this._closeHandler(), this.TIME_TO_HIDE);
  }

  _clearTimer() {
    clearTimeout(this.timer);
    this.timer = null;
  }

  _showMessage(msg, options = {}) {
    const component = Div({
      className: `snackbar-container ${options.error ? 'red' : 'grey'}`,
      children: [
        Div({
          className: 'snackbar-label',
          text: msg,
        }),
        Div({
          className: 'snackbar-dismiss',
          text: '&times;',
          onClick: () => this._closeHandler(),
        }),
      ],
    });

    component.addEventListener('mouseleave', () => this._startTimer());
    component.addEventListener('mouseenter', () => this._clearTimer());
    component.addEventListener('touchend', () => this._startTimer());
    component.addEventListener('touchstart', () => this._clearTimer());

    this._startTimer();
    document.body.appendChild(component);
    this.component = component;
  }

  _closeHandler() {
    this.messages.shift();
    this.component.remove();
    this.component = null;
    this._clearTimer();

    if (this.messages.length) {
      const msg = this.messages[0];
      this._showMessage(msg.msg, { error: !!msg.error });
    }
  }

  displayMsg(msg) {
    this.messages.push({ msg });
    if (!this.component) {
      this._showMessage(msg);
    }
  }

  displayErr(errorMsg) {
    this.messages.push({ msg: errorMsg, error: true });
    if (!this.component) {
      this._showMessage(errorMsg, { error: true });
    }
  }
}

export default new Snackbar();
