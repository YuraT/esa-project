// handles incoming push notifications
self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/favicon-512x512.png",
      badge: "/favicon-512x512.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "2",
      },
    };
    // keeps the service worker going until notification shows
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// when the notification is clicked
self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received.");
  const title = event.notification.title;
  const body = event.notification.body;

  event.notification.close();

  event.waitUntil(
    clients.openWindow(
      `${
        self.location.origin
      }/testing/notification/message?title=${encodeURIComponent(
        title
      )}&body=${encodeURIComponent(body)}`
    )
  );
});
