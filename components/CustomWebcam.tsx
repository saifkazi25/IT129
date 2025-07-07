'use client';

import React, { forwardRef, type Ref } from 'react';
import Webcam from 'react-webcam';

type Props = React.ComponentProps<typeof Webcam>;

// ✅ Use HTMLVideoElement for the ref type
const CustomWebcam = forwardRef((props: Props, ref: Ref<HTMLVideoElement>) => (
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
