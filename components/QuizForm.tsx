"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";

export default function QuizForm() {
  const router = useRouter();

  const [answers, setAnswers] = useState<string[]>(Array(7).fill(""));
  const [selfie, setSelfie] = useState<string | null>(null);
  const webcamRef = useRef<Webcam | null>(null);

  const handleAnswerChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const captureSelfie = () => {
    const img = (webcamRef.current as Webcam | null)?.getScreenshot();
    if (img) setSelfie(img);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfie) {
      aler
