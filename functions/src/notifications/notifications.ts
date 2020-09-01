import { messaging } from "../firebase/firebase";

/**
* Send messaging using Firebase Cloud Messaging.
* See https://firebase.google.com/docs/cloud-messaging/send-message
*/
export async function sendNotification(countries: string[]) {
  // The topic name can be optionally prefixed with "/topics/".
  const topic = 'countries';
  const message = {
    data: { countries: JSON.stringify(countries) },
    topic: topic
  };
  // Send a message to devices subscribed to the provided topic.
  messaging.send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
}