import { useEffect } from 'react';
import './BuyMeACoffee.styles.css';

const BuyMeACoffee = () => {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js';
    script.setAttribute('data-name', 'BMC-Widget');
    script.setAttribute('data-cfasync', 'false');
    script.setAttribute('data-id', 'mrhackio');
    script.setAttribute('data-description', 'Support my work');
    script.setAttribute('data-message', 'Support my work');
    script.setAttribute('data-color', '#FFDD00');
    script.setAttribute('data-position', 'Right');
    script.setAttribute('data-x_margin', '18');
    script.setAttribute('data-y_margin', '18');

    document.body.appendChild(script);

    return () => {
      const widget = document.getElementById('bmc-wbtn');
      if (widget) {
        widget.remove();
      }

      script.remove();
    };
  }, []);

  return null;
};

export default BuyMeACoffee;
