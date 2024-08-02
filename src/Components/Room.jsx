import React, { useRef, useState } from "react";
import { useParams, useLocation } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import axios from 'axios';
import AudioRecorder from "./AudioRecorder";

const Room = () => {

  const { roomID } = useParams(); // Get RoomCode from URL path
  const query = new URLSearchParams(useLocation().search);
  const meetingAgenda = query.get('agenda');
  const number = query.get('number');
  console.log(number, meetingAgenda, roomID)

  // const roomID  = RoomCode
  const meeting = async (element) => {
    const appID = 946219318;
    const serverSecret = "8e0b853d79deae0bcbfe949b73ca46a4";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      Date.now().toString(),
      "andrei"
    );
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },
    });
  };


  return (
    <div className="flex bg-white">
      <div ref={meeting} style={{ width: "80%", height: "100%" }}></div>
      <div style={{ width: "20%", height: "100%" }}>
        <AudioRecorder meetingAgenda={meetingAgenda} number={number} />
      </div>

    </div>
  );
};

export default Room;
