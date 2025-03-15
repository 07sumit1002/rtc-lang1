import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import axios from "axios";

const RoomPage = () => {
  const { roomId } = useParams();
  const [language, setLanguage] = useState("en");
  const [recording, setRecording] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const myMeeting = async (element) => {
    const appID = 1290555631;
    const serverSecret = "93de56c14d703e930bae8d1f1901270f";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      Date.now().toString(),
      "User"
    );
    const zc = ZegoUIKitPrebuilt.create(kitToken);
    zc.joinRoom({
      container: element,
      scenario: { mode: ZegoUIKitPrebuilt.GroupCall },
      showScreenSharingButton: true,
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        await sendAudioToBackend(audioBlob);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Microphone access error:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const sendAudioToBackend = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append("file", audioBlob);
      formData.append("from_language", "en"); // Source language
      formData.append("to_language", language); // Target language

      const response = await axios.post("http://127.0.0.1:8000/translate/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.translated_text) {
        setTranslatedText(response.data.translated_text);
      }
    } catch (error) {
      console.error("Translation Error:", error);
    }
  };

  return (
    <div className="container text-center">
      <div ref={myMeeting} className="meeting-container mb-4" />

      {/* Language Selection */}
      <div className="d-flex justify-content-center align-items-center gap-2">
        <select className="form-select w-auto" value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
          <option value="hi">Hindi</option>
          <option value="ar">Arabic</option>
          <option value="ru">Russian</option>
          <option value="pt">Portuguese</option>
          <option value="ja">Japanese</option>
        </select>
      </div>

      {/* Audio Controls */}
      <div className="mt-4">
        <button className={`btn ${recording ? "btn-danger" : "btn-primary"} me-2`} onClick={recording ? stopRecording : startRecording}>
          {recording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>

      {/* Translated Text */}
      {translatedText && (
        <div className="mt-3">
          <h5>Translated Text:</h5>
          <p className="alert alert-info">{translatedText}</p>
        </div>
      )}
    </div>
  );
};

export default RoomPage;
