"use server";

import webpush from "web-push";

webpush.setVapidDetails(
  "<mailto:your-email@example.com>",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

let subscription: webpush.PushSubscription | null = null;

/**
 * serializes the subscription
 * @param sub the PushSubscription object
 * @returns base64 encoded object
 */
function convertSubscription(sub: PushSubscription) {
  const key = sub.getKey("p256dh"); // get public encryption key
  const auth = sub.getKey("auth"); // get auth secret
  return {
    endpoint: sub.endpoint,
    keys: {
      p256dh: key ? btoa(String.fromCharCode(...new Uint8Array(key))) : "",
      auth: auth ? btoa(String.fromCharCode(...new Uint8Array(auth))) : "",
    },
  };
}

/**
 * adds the user to the database
 * @param sub the PushSubscription object
 * @returns success response
 */
export async function subscribeUser(sub: PushSubscription) {
  // have to store subscription in db
  // ex: await db.subscriptions.create({ data: sub })
  subscription = convertSubscription(sub);
  return { success: true };
}

/**
 * removes the user from the database
 * @returns success response
 */
export async function unsubscribeUser() {
  // remove subscription from db
  // ex: await db.subscriptions.delete({ where: {... } })
  subscription = null;
  return { success: true };
}

/**
 * sends the notification if there is a subscription
 * @param message body text of the notification
 * @returns success response
 */
export async function sendNotification(message: string) {
  if (!subscription) throw new Error("no subscription available");

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "test notification",
        body: message,
        icon: "/apple-icon.png",
      })
    );
    return { success: true };
  } catch (error) {
    console.error("error sending notification", error);
    return { success: false, error: "failed to send notification" };
  }
}
