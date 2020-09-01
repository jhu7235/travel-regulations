import { firestore } from "../firebase/firebase";

interface ITravelRegulation {
  description: string;
  level: number;
  publishedDate: any // firebase date
}

export interface ITravelRegulations {
  [key: string]: ITravelRegulation
}

/**
 * Wrapper class around travelRegulations db collection
 */
export class TravelRegulations {
  // db ref
  private ref = firestore.collection("travelRegulations");

  public getAll = async () => {
    const travelRegulations: ITravelRegulations = {}
    const snap = await this.ref.get()
    snap.docs.forEach(travelRegulation =>
      travelRegulations[travelRegulation.id] = travelRegulation.data() as ITravelRegulation
    )
    return travelRegulations
  }

  /**
   * Updates or creates a travel regulation by country.
   */
  public update(id: string, data: Partial<ITravelRegulation>) {
    return this.ref.doc(id).set(data);
  }

  public getDocRef(id: string) {
    return this.ref.doc(id);
  }
}
