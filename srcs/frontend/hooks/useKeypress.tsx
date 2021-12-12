import { useEffect } from 'react';
/**
 * useKeyPress
 * https://www.caktusgroup.com/blog/2020/07/01/usekeypress-hook-react/
 * @param {string} key - the name of the key to respond to, compared against event.key
 * @param {function} action - the action to perform on key press
 */

export default function useKeypress(key: string, action) {
  useEffect(() => {
    function onKeyup(e:KeyboardEvent) {
      if (e.key === key) action()
    }
    window.addEventListener('keydown', onKeyup);
    return () => window.removeEventListener('keydown', onKeyup);
  });
}
