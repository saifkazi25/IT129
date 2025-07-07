'use client';

import React, { forwardRef } from 'react';
import Webcam from 'react-webcam';

const CustomWebcam = forwardRef<Webcam>((props: any, ref) => (
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
