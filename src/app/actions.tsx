"use server";

import webpush from "web-push";

webpush.setVapidDetails(
  "<mailto:your-email@example.com>",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

let subscription: webpush.PushSubscription | null = null;

const convertSubscription = (sub: PushSubscription) => {
  const key = sub.getKey("p256dh");
  const auth = sub.getKey("auth");
  return {
    endpoint: sub.endpoint,
    keys: {
      p256dh: key ? btoa(String.fromCharCode(...new Uint8Array(key))) : "",
      auth: auth ? btoa(String.fromCharCode(...new Uint8Array(auth))) : "",
    },
  };
};

export const subscribeUser = async (sub: PushSubscription) => {
  // have to store subscription in db
  // ex: await db.subscriptions.create({ data: sub })
  subscription = convertSubscription(sub);
  return { success: true };
};

export const unsubscribeUser = async () => {
  // remove subscription from db
  // ex: await db.subscriptions.delete({ where: {... } })
  subscription = null;
  return { success: true };
};

export const sendNotification = async (message: string) => {
  if (!subscription) throw new Error("no subscription available");

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "test noti",
        body: message,
        icon: "/apple-icon.png",
      })
    );
    return { success: true };
  } catch (error) {
    console.error("error sending noti", error);
    return { success: false, error: "failed to send noti" };
  }
};
