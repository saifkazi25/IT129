'use client';

import React, { forwardRef } from 'react';
import type { Ref } from 'react';
import Webcam, { type WebcamProps } from 'react-webcam';

const CustomWebcam = forwardRef((props: WebcamProps, ref: Ref<Webcam>) => (
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
