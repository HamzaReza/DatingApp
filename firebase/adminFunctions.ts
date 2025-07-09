import { addDoc, collection, getDocs, getFirestore, Timestamp } from "@react-native-firebase/firestore";

export const createEvent = async (event: {
  name: string;
  venue: string;
  price: number;
  genre: string;
  date: Date;
  time: Date;
  creatorName:String;
  image:String
}) => {
  try {
    const db = getFirestore();
    const docRef = await addDoc(collection(db, "events"), {
      name: event.name,
      venue: event.venue,
      price: event.price,
      creatorName:event.creatorName,
      genre: event.genre,
      date: Timestamp.fromDate(event.date),
      time: Timestamp.fromDate(event.time),
      createdAt: Timestamp.now(),
      image:event.image
    });

    console.log("✅ Event created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error creating event:", error);
    throw error;
  }
};

export const fetchEvents = async () => {
  try {
    const db = getFirestore();
    const eventsRef = collection(db, "events");
    const snapshot = await getDocs(eventsRef);

    const events = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        venue: data.venue,
        price: data.price,
        genre: data.genre,
        seat: data.seat || 0,
        date: data.date instanceof Timestamp ? data.date.toDate().toLocaleDateString() : data.date,
        time: data.time instanceof Timestamp ? data.time.toDate().toLocaleTimeString() : data.time,
      };
    });

    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
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
    console.error("Error creating pricing plan:", error);
    throw error;
  }
};

export const fetchPricingPlans = async () => {
  try {
    const db = getFirestore();
    const snapshot = await getDocs(collection(db, "pricingPlans"));

    const plans = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return plans;
  } catch (error) {
    console.error("Error fetching pricing plans:", error);
    throw error;
  }
};

export const addCreator = async (creator: {
  name: string;
  image: string;
}) => {
  const db = getFirestore();
  const docRef = await addDoc(collection(db, "creatorsData"), {
    ...creator,
    createdAt: new Date(),
  });

  return docRef.id; // Return the newly created creator's docId
};

export const fetchCreators = async () => {
  const db = getFirestore();
  const snapshot = await getDocs(collection(db, "creatorsData"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};



