import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  Timestamp,
} from "@react-native-firebase/firestore";

const createEvent = async (event: {
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
    console.log("🚀 ~ admin.ts:24 ~ createEvent ~ event:", event);
    const docRef = await addDoc(collection(db, "events"), {
      name: event.name,
      venue: event.venue,
      price: event.price,
      normalTicket: event.normalTicket,
      vipTicket: event.vipTicket,
      creator: event.creator,
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

const fetchEvents = (callback: (events: any[]) => void) => {
  try {
    const db = getFirestore();
    const eventsRef = collection(db, "events");

    const unsubscribe = onSnapshot(
      eventsRef,
      snapshot => {
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
              id: data.creator.id,
              label: data.creator.label,
              image: data.creator.image,
            },
            image: data.image,
            date: data.date?.toDate?.()?.toLocaleDateString() || data.date,
            time: data.time?.toDate?.()?.toLocaleTimeString() || data.time,
          };
        });

        callback(events);
      },
      error => {
        console.error("Error in events listener:", error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up events listener:", error);
    throw error;
  }
};

const createPricingPlan = async (plan: {
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

const fetchPricingPlans = (callback: (plans: any[]) => void) => {
  try {
    const db = getFirestore();

    const unsubscribe = onSnapshot(
      collection(db, "pricingPlans"),
      snapshot => {
        const plans = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        callback(plans);
      },
      error => {
        console.error("Error in pricing plans listener:", error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up pricing plans listener:", error);
    throw error;
  }
};

const addCreator = async (creator: { name: string; image: string }) => {
  const db = getFirestore();
  const docRef = await addDoc(collection(db, "creator"), {
    ...creator,
    createdAt: new Date(),
  });

  return docRef.id;
};

const fetchCreators = (callback: (creators: any[]) => void) => {
  try {
    const db = getFirestore();

    const unsubscribe = onSnapshot(
      collection(db, "creator"),
      snapshot => {
        const creators = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        callback(creators);
      },
      error => {
        console.error("Error in creators listener:", error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up creators listener:", error);
    throw error;
  }
};

const fetchUsers = (callback: (users: any[]) => void) => {
  try {
    const db = getFirestore();

    const unsubscribe = onSnapshot(
      collection(db, "users"),
      snapshot => {
        const usersData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            status: data.status || "pending",
          };
        });

        callback(usersData);
      },
      error => {
        console.error("Error in users listener:", error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up users listener:", error);
    throw error;
  }
};

export {
  addCreator,
  createEvent,
  createPricingPlan,
  fetchCreators,
  fetchEvents,
  fetchPricingPlans,
  fetchUsers,
};
