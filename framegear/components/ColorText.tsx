import { silkScreen } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import React, { ReactHTML } from 'react';

const ColorfulText = ({
  text,
  className,
  element = 'p',
  ...rest
}: {
  text: string;
  element?: keyof ReactHTML;
} & React.HTMLAttributes<HTMLParagraphElement>) => {
  // Define an array of colors
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#F833FF', '#FF8333'];

  // Split the text into an array of characters
  const textChars = text.split('');

  const el = React.createElement(
    element,
    { className: cn(silkScreen.className, className), ...rest },
    textChars.map((char, index) => (
      <span key={index} style={{ color: colors[index % colors.length] }}>
        {char}
      </span>
    )),
  );

  return el;
};

export default ColorfulText;
