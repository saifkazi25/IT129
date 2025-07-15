"use client";

import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import type { Webcam as ReactWebcamInstance } from "react-webcam"; // ✅ import type separately
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<ReactWebcamInstance | null>(null); // ✅ fix the type
  const router = useRouter();
  // ... rest of your code
}
