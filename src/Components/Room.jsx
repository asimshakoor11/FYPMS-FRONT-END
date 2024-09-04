import React, { useRef, useEffect, useState } from "react";
import { useParams, useLocation } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import AudioRecorder from "./AudioRecorder";

const Room = () => {
  const { roomID } = useParams(); // Get RoomCode from URL path
  const query = new URLSearchParams(useLocation().search);
  const meetingAgenda = query.get('agenda');
  const number = query.get('number');

  const role = localStorage.getItem("userRole");
  const name = localStorage.getItem("loggedInUserName");

  const meetingContainerRef = useRef(null); // Ref for the meeting container
  const isMeetingInitialized = useRef(false); // Ref to track initialization

  useEffect(() => {
    const meeting = async () => {
      const appID = 946219318;
      const serverSecret = "8e0b853d79deae0bcbfe949b73ca46a4";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        Date.now().toString(),
        name
      );
      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: meetingContainerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },
      });
    };

    if (meetingContainerRef.current && !isMeetingInitialized.current) {
      isMeetingInitialized.current = true; // Mark as initialized
      meeting();
    }
  }, [roomID, name]);

  return (
    <div className="flex bg-white h-screen">
      <div
        ref={meetingContainerRef}
        className={`${role === 'Student' ? 'w-full' : 'w-4/5'} h-full`}
      ></div>
      {
        role !== 'Student' && (
          <div style={{ width: "20%", height: "100%" }}>
            <AudioRecorder meetingAgenda={meetingAgenda} number={number} />
          </div>
        )
      }
    </div>
  );
};

export default Room;
