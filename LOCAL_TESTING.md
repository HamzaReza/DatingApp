# 🧪 Local Testing Guide for Stripe Payment Integration

## 🚀 Quick Start

### 1. Start Firebase Emulators

```bash
firebase emulators:start --only functions,firestore
```

### 2. Start Your React Native App

```bash
npx expo start
```

### 3. Test the Payment Flow

1. Navigate to a chat with a match
2. Send 6 messages to trigger the payment modal
3. Use test card: `4242 4242 4242 4242`

## 🔧 Configuration

### Firebase Emulator Setup

Your app is automatically configured to use local emulators in development mode:

- **Functions**: `localhost:5001`
- **Firestore**: `localhost:8080`
- **Emulator UI**: `localhost:4000`

### Test Card Details

- **Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., `12/25`)
- **CVC**: Any 3 digits (e.g., `123`)
- **ZIP**: Any 5 digits (e.g., `12345`)

## 📊 Monitoring

### Emulator UI

Visit `http://localhost:4000` to:

- View real-time logs
- Monitor Firestore data
- Check function executions
- Debug payment flows

### Console Logs

Check your React Native console for:

- Payment initialization logs
- Stripe API responses
- Firebase function calls
- Error messages

## ⚡ Testing Scenarios

### 1. Successful Payment

- Complete payment with valid test card
- Verify payment status updates to "completed"
- Check Firestore for payment records

### 2. Failed Payment

- Use test card: `4000 0000 0000 0002` (declined)
- Verify error handling and user feedback

### 3. Refund Testing

- Make a payment
- Wait 10 minutes (testing window)
- Check if refund is processed automatically
- Verify refund status in Firestore

### 4. Match Payment Status

- Test with two users in a match
- Verify both users need to pay
- Check match payment status updates

## 🐛 Debugging

### Common Issues

1. **Emulator Not Running**

   ```bash
   # Check if emulators are running
   curl http://localhost:5001
   curl http://localhost:8080
   ```

2. **Function Not Found**

   - Ensure functions are deployed to emulator
   - Check function names match exactly

3. **Payment Fails**
   - Verify Stripe test keys are set
   - Check emulator logs for errors
   - Ensure test card details are correct

### Log Locations

- **Firebase Functions**: Emulator UI → Functions tab
- **Firestore**: Emulator UI → Firestore tab
- **React Native**: Metro bundler console
- **Stripe**: Stripe Dashboard → Logs

## 🔄 Switching Between Local and Production

### Local Development

- Emulators automatically used in `__DEV__` mode
- No additional configuration needed

### Production Testing

- Deploy functions: `firebase deploy --only functions`
- Remove emulator configuration for production builds

## 📝 Test Checklist

- [ ] Firebase emulators running
- [ ] React Native app connected to emulators
- [ ] Payment modal appears after 6 messages
- [ ] Test card payment succeeds
- [ ] Payment status updates in Firestore
- [ ] Refund processes after 10 minutes
- [ ] Error handling works for failed payments
- [ ] Match payment status updates correctly

## 🎯 Next Steps

1. Test with real Stripe test cards
2. Verify webhook handling (if needed)
3. Test edge cases and error scenarios
4. Deploy to production when ready

---

**Happy Testing! 🚀**
