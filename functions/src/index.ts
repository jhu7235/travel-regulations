import * as iataRegulationsService from './services/iataRegulationsService'
import { sendNotification } from "./notifications/notifications";
import { TravelRegulations } from "./firestore/travelRegulations"
import { firestore, functions } from './firebase/firebase';

// TODO: implement stricter linting rules

/**
 * Syncs travel regulations from iata source to firestore db. Then publishes changes
 * via firebase messaging.
 * 
 * TODO: restrict endpoint access to only allow google cloud cron service
 * Triggered by pubsub (https://console.cloud.google.com/cloudscheduler?project=covid-border)
 * locally served at http://localhost:5034/covid-border/us-central1/syncTravelRegulations
 */
exports.syncTravelRegulations = functions.https.onRequest(async (req, res) => {
  console.log('syncing travel regulations...');
  try {
    const travelRegulations = new TravelRegulations();
    const iataRegulations = await iataRegulationsService.getRegulations();
    // NOTE: getting all since we're going to be comparing all
    const allTravelRegulations = await travelRegulations.getAll();
    const batch = firestore.batch();
    // tracks countries whose info has changed. Used for push notification
    const diff: string[] = [];
    Object.keys(iataRegulations).forEach(async (countryCode) => {
      const iataRegulation = iataRegulations[countryCode];
      const travelRegulation = allTravelRegulations[countryCode];
      if (!travelRegulation || travelRegulation.description !== iataRegulation.description) {
        console.log('data changed', iataRegulation.description);
        const docRef = travelRegulations.getDocRef(countryCode);
        batch.set(docRef, iataRegulation);
        diff.push(countryCode);
      }
    });

    if (diff.length > 0) {
      await batch.commit();
      await sendNotification(diff);
    }
    console.log('travel regulations sync complete');
    res.json({ result: `travel regulations synced.` });
  } catch (e) {
    console.error('travel regulations sync erred', e);
    throw e;
  }
});

