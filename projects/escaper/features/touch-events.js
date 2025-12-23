let xDown = null;
let yDown = null;
let moveHandler = null;

function handleTouchStart(evt) {
  const firstTouch = evt.touches[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove({
  onSwipeUp,
  onSwipeDown,
  onSwipeRight,
  onSwipeLeft,
}) {
  return evt => {
    if (!xDown || !yDown) {
      return;
    }

    const xDiff = xDown - evt.touches[0].clientX;
    const yDiff = yDown - evt.touches[0].clientY;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff < 0) onSwipeRight();
      else onSwipeLeft();
    } else {
      if (yDiff < 0) onSwipeDown();
      else onSwipeUp();
    }

    xDown = null;
    yDown = null;
  };
}

export function initSwipeEvent({
  onSwipeUp,
  onSwipeDown,
  onSwipeRight,
  onSwipeLeft,
}) {
  moveHandler = handleTouchMove({
    onSwipeUp,
    onSwipeDown,
    onSwipeRight,
    onSwipeLeft,
  });
  window.addEventListener('touchstart', handleTouchStart, false);
  window.addEventListener('touchmove', moveHandler, false);
}

export function removeSwipeEvent() {
  window.removeEventListener('touchstart', handleTouchStart);
  window.removeEventListener('touchstart', moveHandler);
  moveHandler = null;
}
