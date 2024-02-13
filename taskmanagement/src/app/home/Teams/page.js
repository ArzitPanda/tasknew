"use client"
import React, { useEffect, useRef } from 'react';
import { ZoomMtg } from '@zoomus/websdk';

const Page = () => {
  const zoomContainerRef = useRef(null);

  useEffect(() => {
    ZoomMtg.setZoomJSLib('https://source.zoom.us/1.9.0/lib', '/av');
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();

    const zoomMeeting = {
      apiKey:"AVlhl7cBTa6kOofBo_rew",
      apiSecret:"mPOCigMH2gSpQWjrLudFj5syHLdkcH5t",
      meetingNumber: '123445678',

      leaveUrl: 'http://localhost:3000', // URL to redirect users after leaving the meeting
    };

    ZoomMtg.init({
      leaveUrl: zoomMeeting.leaveUrl,
      isSupportAV: true,
      success: () => {
        console.log('Zoom SDK initialized successfully');

        participants.forEach((participant) => {
          ZoomMtg.join({
            ...zoomMeeting,
            
            success: (success) => {
              console.log('Joined Zoom meeting successfully ');
            },
            error: (error) => {
              console.error(`Failed to join Zoom meeting`);
            }
          });
        });
      },
      error: (error) => {
        console.error('Failed to initialize Zoom SDK', error);
      }
    });

    return () => {
      ZoomMtg.leaveMeeting({});
    };
  }, [ ]);

  return <div ref={zoomContainerRef} id="zmmtg-root"></div>;
};

export default Page;
