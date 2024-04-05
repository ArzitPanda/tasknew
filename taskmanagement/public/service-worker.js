
self.addEventListener('push', function(event) {
    console.log('Push received', event?.data.json());
    const data =event?.data.json()
    console.log("data is "+event?.data.json())
    const title = data.title;
    const options = {
      body: data.body,
      icon: './logo.png',
      badge: 'path_to_your_badge.png',
      data:data
    };
  
  
      
      self.registration.showNotification(title, options)
   
  });
  const BASE_URL="https://taskifyer.vercel.app"
  self.addEventListener('notificationclick', function(event) {
    const clickedNotificationData = event.notification.data; // Retrieve data from the clicked notification
    event.notification.close();
    console.log(clickedNotificationData)
    event.waitUntil(
      clients.openWindow(openLink(clickedNotificationData))// Use the data passed in the notification to redirect
    );
});



const openLink=(data)=>{
    if(data?.type==='QUERY')
    {
      return BASE_URL+'Query'
    }
    else if(data?.type==='TEAM')
    {
      return BASE_URL+'Team/'+data?.id
    }
    else
    {
      return BASE_URL+'Task'
    }


}