import { useEffect } from 'react';
/**
 * useKeyPress
 * https://www.caktusgroup.com/blog/2020/07/01/usekeypress-hook-react/
 * @param {string} key - the name of the key to respond to, compared against event.key
 * @param {function} action - the action to perform on key press
 */

type alertFunction = (offsetY: number) => void;

export default function useKeypress(key: string, action: alertFunction, offsetY: number) {
  useEffect(() => {
    function onKeyup(e:KeyboardEvent) {
      if (e.key === key) action(offsetY)
    }
    window.addEventListener('keyup', onKeyup);
    return () => window.removeEventListener('keyup', onKeyup);
  }, [offsetY]);
}
