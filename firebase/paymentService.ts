import { getFunctions } from "@react-native-firebase/functions";
import { createEventTicketPaymentIntent } from "./stripe";

export interface PaymentMethod {
  id: string;
  name: string;
  type: "apple_pay" | "google_pay" | "paypal" | "card";
  enabled: boolean;
}

export interface PaymentData {
  paymentId: string;
  clientSecret: string;
  paymentMethod: string;
}

export class PaymentService {
  private static instance: PaymentService;

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  /**
   * Get available payment methods for the current platform
   */
  getAvailablePaymentMethods(): PaymentMethod[] {
    return [
      {
        id: "apple_pay",
        name: "Apple Pay",
        type: "apple_pay",
        enabled: true, // Stripe will handle availability check
      },
      {
        id: "google_pay",
        name: "Google Pay",
        type: "google_pay",
        enabled: true, // Stripe will handle availability check
      },
      {
        id: "paypal",
        name: "PayPal",
        type: "paypal",
        enabled: true,
      },
      {
        id: "card",
        name: "Debit/Credit Card",
        type: "card",
        enabled: true,
      },
    ];
  }

  /**
   * Create payment intent for event tickets with specific payment method
   */
  async createEventTicketPayment(
    userId: string,
    eventId: string,
    amount: number,
    quantity: number,
    ticketType: "normal" | "vip",
    paymentMethod: string
  ): Promise<PaymentData> {
    try {
      // Generate payment ID
      const paymentId = await createEventTicketPaymentIntent(userId, eventId);

      // Call Firebase function to create payment intent
      const createEventTicketPaymentIntentFunction =
        getFunctions().httpsCallable("createEventTicketPaymentIntent");

      const result = await createEventTicketPaymentIntentFunction({
        paymentId,
        amount: amount * 100, // Convert to cents
        eventId,
        ticketType,
        quantity,
        userId,
        paymentMethod, // Pass the selected payment method
      });

      const { clientSecret } = result.data as { clientSecret: string };

      return {
        paymentId,
        clientSecret,
        paymentMethod,
      };
    } catch (error) {
      console.error("Error creating payment intent:", error);
      throw new Error("Failed to create payment intent");
    }
  }

  /**
   * Get payment method configuration for Stripe PaymentSheet
   */
  getPaymentMethodConfiguration(paymentMethod: string) {
    const baseConfig = {
      applePay: {
        merchantId: "merchant.com.datingapp.payments", // Replace with your actual Apple Merchant ID
        merchantCountryCode: "US",
      },
      googlePay: {
        merchantId: "12345678901234567890", // Replace with your actual Google Pay Merchant ID
        merchantCountryCode: "US",
        testEnvironment: __DEV__, // Use test environment in development
      },
      paypal: {
        merchantId: "A12345678901234567890", // Replace with your actual PayPal Client ID
        merchantCountryCode: "US",
      },
    };

    switch (paymentMethod) {
      case "apple_pay":
        return baseConfig.applePay;
      case "google_pay":
        return baseConfig.googlePay;
      case "paypal":
        return baseConfig.paypal;
      default:
        return undefined;
    }
  }

  /**
   * Validate payment method selection
   */
  validatePaymentMethod(paymentMethod: string): boolean {
    const availableMethods = this.getAvailablePaymentMethods();
    return availableMethods.some(
      method => method.id === paymentMethod && method.enabled
    );
  }
}

export default PaymentService;
