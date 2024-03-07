"use client"
import React, { useEffect, useRef } from 'react';


const Page = () => {
  const zoomContainerRef = useRef(null);
  const zoomMeeting = {
    apiKey:"9S_wps7kSUiuOXOJT600w",
    apiSecret:"3GhNBLQdrH3WkEtyvjWjzV21zttPHiU2",
    meetingNumber: '87596849760',

    leaveUrl: 'http://localhost:3000', // URL to redirect users after leaving the meeting
  };
  useEffect(() => {

    const toZoom =async () =>{


      const {ZoomMtg} = await  import('@zoomus/websdk')
      ZoomMtg.setZoomJSLib('https://source.zoom.us/lib', '/av');
      ZoomMtg.preLoadWasm();
      ZoomMtg.prepareWebSDK();
  
        ZoomMtg.generateSDKSignature(
            {
              meetingNumber: zoomMeeting.meetingNumber,
              role: '0',
              sdkKey: zoomMeeting.apiKey,
              sdkSecret:zoomMeeting.apiSecret,
              success:(signature)=>{
                    ZoomMtg.init({

                      leaveUrl:zoomMeeting.leaveUrl,
                      success:(data)=>{
                          ZoomMtg.join(

                            {
                              signature:signature.result,
                              meetingNumber:zoomMeeting.meetingNumber,
                              userName:"testing",
                              passWord:"D6DAf9",
                              sdkKey:zoomMeeting.apiKey
                            }
                          );


                      },
                      error:(data)=>{console.log(data)}
                      
                    })
              },
              error:(err)=>{console.log(err)}
            }


        ); ///
  




    }
toZoom()
  }, [ ]);

  return <div  id="zmmtg-root"></div>;
};

export default Page;
