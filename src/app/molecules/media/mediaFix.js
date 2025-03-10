import $ from 'jquery';

const chatboxQuery = '#chatbox-scroll';
const roomViewQuery = '> .room-view__content #chatbox';
const timeoutFixer = { i: 200, value: 10 };
let height = null;

let tinyFix = 0;
setInterval(() => {
  if (tinyFix > 0) tinyFix--;
}, 5000);

export default function tinyFixScrollChat(tinyI = timeoutFixer.i) {
  tinyFix++;
  for (let i = 0; i < tinyI; i++) {
    setTimeout(() => {
      if (typeof height === 'number') {
        const scrollBar = $(chatboxQuery);
        const roomView = scrollBar.find(roomViewQuery);

        const oldHeight = height;
        const newHeight = roomView.height();
        height = newHeight;

        const diffHeight = newHeight - oldHeight;
        if (diffHeight > 0) scrollBar.animate({ scrollTop: scrollBar.scrollTop() + diffHeight }, 0);
      }
    }, timeoutFixer.value * tinyFix);
  }
}

export function setMediaHeight(value = null) {
  height =
    typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value) && value > -1
      ? value
      : $('#chatbox-scroll > .room-view__content #chatbox').height();
}
