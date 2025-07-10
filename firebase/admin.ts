import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  Timestamp,
} from "@react-native-firebase/firestore";

export const createEvent = async (event: {
  name: string;
  venue: string;
  price: number;
  normalTicket: number;
  vipTicket: number;
  genre: string;
  date: string;
  time: string;
  creator: { id: string; label: string; image: string };
  image: string;
}) => {
  try {
    const db = getFirestore();
    const docRef = await addDoc(collection(db, "events"), {
      name: event.name,
      venue: event.venue,
      price: event.price,
      normalTicket: event.normalTicket,
      vipTicket: event.vipTicket,
      creatorName: event.creator.label,
      genre: event.genre,
      date: event.date,
      time: event.time,
      createdAt: Timestamp.now(),
      image: event.image,
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const fetchEvents = async () => {
  try {
    const db = getFirestore();
    const eventsRef = collection(db, "events");
    const snapshot = await getDocs(eventsRef);

    const events = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        venue: data.venue,
        price: data.price,
        genre: data.genre,
        normalTicket: data.normalTicket,
        vipTicket: data.vipTicket,
        creator: {
          id: data.creatorId,
          label: data.creatorName,
          image: data.creatorImage,
        },
        image: data.image,
        date: data.date.toDate().toLocaleDateString(),
        time: data.time.toDate().toLocaleTimeString(),
      };
    });

    return events;
  } catch (error) {
    throw error;
  }
};

export const createPricingPlan = async (plan: {
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
}) => {
  try {
    const db = getFirestore();
    const docRef = await addDoc(collection(db, "pricingPlans"), {
      ...plan,
      createdAt: new Date(),
    });

    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const fetchPricingPlans = async () => {
  try {
    const db = getFirestore();
    const snapshot = await getDocs(collection(db, "pricingPlans"));

    const plans = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return plans;
  } catch (error) {
    throw error;
  }
};

export const addCreator = async (creator: { name: string; image: string }) => {
  const db = getFirestore();
  const docRef = await addDoc(collection(db, "creator"), {
    ...creator,
    createdAt: new Date(),
  });

  return docRef.id;
};

export const fetchCreators = async () => {
  const db = getFirestore();
  const snapshot = await getDocs(collection(db, "creator"));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};
