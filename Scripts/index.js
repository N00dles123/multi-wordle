class GameRow extends HTMLElement {
  constructor() {
    super();
  }
}

class GuessBox extends HTMLElement {
  constructor() {
    super();
  }
}

window.customElements.define("game-row", GameRow);
window.customElements.define("guess-box", GuessBox);
