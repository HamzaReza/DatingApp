import {
  doc,
  getDoc,
  getFirestore,
  increment,
  setDoc,
} from "@react-native-firebase/firestore";
import { updateEvent } from "./event";

export async function addOrUpdateTicketSale(
  eventId: string,
  userUid: string,
  normalTicketPurchased: number,
  vipTicketPurchased: number,
  paymentMethod: string
) {
  const db = getFirestore();
  const saleDocRef = doc(db, "sale", eventId);

  let saleData = (await getDoc(saleDocRef)).data() || {};
  if (!saleData || typeof saleData !== "object") saleData = {};

  const userTickets = saleData[userUid] || {
    normalTicketPurchased: 0,
    vipTicketPurchased: 0,
    paymentMethod: paymentMethod,
  };

  // Convert to numbers and add to existing values
  const existingNormalTickets =
    parseInt(userTickets.normalTicketPurchased, 10) || 0;
  const existingVipTickets = parseInt(userTickets.vipTicketPurchased, 10) || 0;

  // Add new purchases to existing values
  const updatedNormalTickets = existingNormalTickets + normalTicketPurchased;
  const updatedVipTickets = existingVipTickets + vipTicketPurchased;

  // Calculate the difference to update event ticket counts
  const normalTicketsDifference = updatedNormalTickets - existingNormalTickets;
  const vipTicketsDifference = updatedVipTickets - existingVipTickets;

  // Update both the sale document and the event document
  await Promise.all([
    // Update sale document
    setDoc(
      saleDocRef,
      {
        [userUid]: {
          normalTicketPurchased: updatedNormalTickets,
          vipTicketPurchased: updatedVipTickets,
          paymentMethod: paymentMethod,
        },
      },
      { merge: true }
    ),
    // Update event ticket counts using the updateEvent function
    updateEvent(eventId, {
      normalTicketSold: increment(normalTicketsDifference),
      vipTicketSold: increment(vipTicketsDifference),
      normalTicket: increment(-normalTicketsDifference), // Decrease available tickets
      vipTicket: increment(-vipTicketsDifference), // Decrease available tickets
    }),
  ]);
}
