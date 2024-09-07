import React, { useEffect, useRef } from "react";
import { useParams, useLocation } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import AudioRecorder from "./AudioRecorder";
 
const Room = () => {
  const { roomID } = useParams();
  const query = new URLSearchParams(useLocation().search);
  const meetingAgenda = query.get('agenda');
  const number = query.get('number');

  const role = localStorage.getItem("userRole");
  const name = localStorage.getItem("loggedInUserName");

  const meetingContainerRef = useRef(null);
  const isMeetingInitialized = useRef(false);

  useEffect(() => {
    if (!isMeetingInitialized.current && meetingContainerRef.current) {
      const initMeeting = async () => {
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
          // sharedLinks: [
          //   {
          //     name: 'Copy link',
          //     url:
          //       window.location.protocol + '//' +
          //       window.location.host + window.location.pathname +
          //       '?roomID=' +
          //       roomID,
          //   },
          // ],
          scenario: {
            mode: ZegoUIKitPrebuilt.GroupCall,
          },
        });
      };

      initMeeting();
      isMeetingInitialized.current = true; // Mark as initialized
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
