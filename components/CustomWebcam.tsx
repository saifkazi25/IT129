'use client';

import React, { forwardRef, type Ref } from 'react';
import Webcam from 'react-webcam';

// ✅ Safe type inference for props
type Props = React.ComponentProps<typeof Webcam>;

const CustomWebcam = forwardRef((props: Props, ref: Ref<Webcam>) => (
  <Webcam
    ref={ref}
    audio={false}
    screenshotFormat="image/jpeg"
    className="rounded-xl border mb-4"
    videoConstraints={{ facingMode: 'user' }}
    {...props}
  />
));

CustomWebcam.displayName = 'CustomWebcam';

export default CustomWebcam;
