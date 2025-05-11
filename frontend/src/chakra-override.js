// src/chakra-override.js
import { Collapse as OriginalCollapse } from '@chakra-ui/transition';
import { forwardRef } from 'react';

const CustomCollapse = forwardRef((props, ref) => {
  const { children, ...rest } = props;
  return (
    <OriginalCollapse {...rest} ref={ref}>
      {children}
    </OriginalCollapse>
  );
});

export { CustomCollapse };
