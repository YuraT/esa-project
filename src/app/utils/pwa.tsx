"use client";

import { useState, useEffect } from "react";
import { subscribeUser, unsubscribeUser, sendNotification } from "../actions";

/**
 * converts base64 to Uint8Array
 * @param base64String the public VAPID key
 * @returns the applicationServerKey for pushManager.subscribe()
 */
function urlBase64ToUint8Array(base64String: string) {
  // adds padding so the base64 string length is a multiple of 4 (required by window.atob())
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  // replace - with + and _ with /
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  // decodes the new base64 string
  const rawData = window.atob(base64);

  // create a new Uint8Array 
  // for every char in the decoded string, add it to the array
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * manages subscribing, unsubscribing, and pushing notifications
 * @returns push notification prompts 
 *          subscribed -> unsubscribe button, enter message input
 *          unsubsribed -> subscribe button
 */
function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [message, setMessage] = useState("");

  // runs only once on page load to check if the browser supports service workers 
  // and push notifications
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    // registers the service worker
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/", // controls all pages under "/"
      updateViaCache: "none", // avoids using HTTP cache when updating
    });

    // get any existing subscriptions
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function subscribeToPush() {
    // wait until registration is ready
    const registration = await navigator.serviceWorker.ready;

    // create and set a new PushSubscription using the VAPID public key
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true, // every push must have a visible notification
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });
    setSubscription(sub);

    // makes a JSON object to send to backend
    const serializedSub = JSON.parse(JSON.stringify(sub));
    await subscribeUser(serializedSub);
  }

  async function unsubscribeFromPush() {
    // if there is a sub, unsubscribe
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser(); // unsub from backend
  }

  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message);
      setMessage("");
    }
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>;
  }

  return (
    <div>
      <h3>Push Notifications</h3>
      {subscription ? (
        <>
          <p>You are subscribed to push notifications.</p>
          <button onClick={unsubscribeFromPush}>Unsubscribe</button>
          <input
            type="text"
            placeholder="Enter notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendTestNotification}>Send Test</button>
        </>
      ) : (
        <>
          <p>You are not subscribed to push notifications.</p>
          <button onClick={subscribeToPush}>Subscribe</button>
        </>
      )}
    </div>
  );
}

/**
 * prompt to install the app for iOS devices
 * @returns install prompt
 */
function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  // runs only once on page to check if the device is iOS
  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );

    // checks if the app is installed to the home screen 
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  if (isStandalone) {
    return null; // don't show install button if the app is already installed
  }

  return (
    <div>
      <h3>Install App</h3>
      <button>Add to Home Screen</button>
      {isIOS && (
        <p>
          To install this app on your iOS device, tap the share button
          <span role="img" aria-label="share icon">
            {" "}
            ⎋{" "}
          </span>
          and then "Add to Home Screen"
          <span role="img" aria-label="plus icon">
            {" "}
            ➕{" "}
          </span>
          .
        </p>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <div>
      <PushNotificationManager />
      <InstallPrompt />
    </div>
  );
}
