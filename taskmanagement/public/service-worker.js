self.addEventListener('push', function(event) {
    console.log('Push received', event);
  
    const title = 'Your Title';
    const options = {
      body: "hello",
      icon: 'path_to_your_icon.png',
      badge: 'path_to_your_badge.png'
    };
  
  
      
      self.registration.showNotification(title, options)
   
  });
  