"use server";
import webpush, { PushSubscription } from "web-push";

webpush.setVapidDetails(
  `mailto:${process.env.EMAIL}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

let subscription: PushSubscription | null;

/**
 * adds the user to the database
 * @param sub the PushSubscription object
 * @returns success response
 */
export async function subscribeUser(sub: PushSubscription) {
  // have to store subscription in db
  // ex: await db.subscriptions.create({ data: sub })
  subscription = sub;
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
        icon: "/favicon-512x512.png",
      })
    );
    return { success: true };
  } catch (error) {
    console.error("error sending notification", error);
    return { success: false, error: "failed to send notification" };
  }
}
