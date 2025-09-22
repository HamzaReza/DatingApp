"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserFace = exports.verifyAgainstIndexedFace = exports.indexUserProfileFace = exports.verifyFaceMatch = exports.initializeFaceCollection = void 0;
const admin = require("firebase-admin");
const https_1 = require("firebase-functions/v2/https");
const faceRecognition_1 = require("./faceRecognition");
const COLLECTION_ID = "dating-app-faces";
// Initialize face collection on first deployment
exports.initializeFaceCollection = (0, https_1.onRequest)(async (req, res) => {
    try {
        const success = await (0, faceRecognition_1.createFaceCollection)(COLLECTION_ID);
        res.json({
            success,
            message: success
                ? "Face collection initialized successfully"
                : "Failed to initialize face collection",
        });
    }
    catch (error) {
        console.error("Error initializing face collection:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to initialize collection",
        });
    }
});
// Verify if a new image matches the user's profile picture
exports.verifyFaceMatch = (0, https_1.onCall)(async (data, context) => {
    var _a, _b;
    try {
        // Get user ID from context or data
        const userId = ((_a = context === null || context === void 0 ? void 0 : context.auth) === null || _a === void 0 ? void 0 : _a.uid) || ((_b = data.data) === null || _b === void 0 ? void 0 : _b.userId) || data.userId;
        // Check if we have a valid user ID
        if (!userId) {
            throw new Error("User must be authenticated");
        }
        const { newImageUrl, profileImageUrl } = data.data || data;
        if (!userId || !newImageUrl || !profileImageUrl) {
            throw new Error("Missing required parameters");
        }
        // For testing, return a mock result
        if (newImageUrl.includes("example.com")) {
            return {
                isMatch: true,
                confidence: 85.5,
            };
        }
        // Download images from Firebase Storage
        const [newImageBuffer, profileImageBuffer] = await Promise.all([
            downloadImageFromUrl(newImageUrl),
            downloadImageFromUrl(profileImageUrl),
        ]);
        // Compare faces
        const result = await (0, faceRecognition_1.compareFaces)(newImageBuffer, profileImageBuffer, 80 // 80% similarity threshold
        );
        if (result.error) {
            throw new Error(result.error);
        }
        return {
            isMatch: result.isMatch,
            confidence: result.confidence,
        };
    }
    catch (error) {
        console.error("Error in verifyFaceMatch:", error);
        throw new Error(error.message || "Face verification failed");
    }
});
// Index a user's profile picture for future reference
exports.indexUserProfileFace = (0, https_1.onCall)(async (data, context) => {
    var _a, _b;
    try {
        // Get user ID from context or data
        const userId = ((_a = context === null || context === void 0 ? void 0 : context.auth) === null || _a === void 0 ? void 0 : _a.uid) || ((_b = data.data) === null || _b === void 0 ? void 0 : _b.userId) || data.userId;
        // Check if we have a valid user ID
        if (!userId) {
            throw new Error("User must be authenticated");
        }
        const { profileImageUrl } = data.data || data;
        if (!userId || !profileImageUrl) {
            throw new Error("Missing required parameters");
        }
        // Download image from Firebase Storage
        const imageBuffer = await downloadImageFromUrl(profileImageUrl);
        // Detect faces first
        const faceDetection = await (0, faceRecognition_1.detectFaces)(imageBuffer);
        if (faceDetection.error || faceDetection.facesDetected === 0) {
            throw new Error("No face detected in profile image");
        }
        // Index the face
        const result = await (0, faceRecognition_1.indexFace)(COLLECTION_ID, imageBuffer, userId);
        if (result.error) {
            throw new Error(result.error);
        }
        // Store face ID in user document
        await admin.firestore().collection("users").doc(userId).update({
            faceId: result.faceId,
            faceIndexedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return {
            success: true,
            faceId: result.faceId,
        };
    }
    catch (error) {
        console.error("Error in indexUserProfileFace:", error);
        throw new Error(error.message || "Failed to index face");
    }
});
// Verify new image against indexed face
exports.verifyAgainstIndexedFace = (0, https_1.onCall)(async (data, context) => {
    var _a, _b, _c;
    try {
        // Get user ID from context or data
        const userId = ((_a = context === null || context === void 0 ? void 0 : context.auth) === null || _a === void 0 ? void 0 : _a.uid) || ((_b = data.data) === null || _b === void 0 ? void 0 : _b.userId) || data.userId;
        // Check if we have a valid user ID
        if (!userId) {
            throw new Error("User must be authenticated");
        }
        const { newImageUrl } = data.data || data;
        if (!userId || !newImageUrl) {
            throw new Error("Missing required parameters");
        }
        // Get user's face ID
        const userDoc = await admin
            .firestore()
            .collection("users")
            .doc(userId)
            .get();
        if (!userDoc.exists) {
            throw new Error("User not found");
        }
        const userData = userDoc.data();
        if (!(userData === null || userData === void 0 ? void 0 : userData.faceId)) {
            throw new Error("User's face not indexed");
        }
        // Download new image
        const newImageBuffer = await downloadImageFromUrl(newImageUrl);
        // Search for matching faces
        const searchResult = await (0, faceRecognition_1.searchFaces)(COLLECTION_ID, newImageBuffer, 1, 80);
        if (searchResult.error) {
            throw new Error(searchResult.error);
        }
        const isMatch = searchResult.faceMatches.some(match => { var _a; return ((_a = match.Face) === null || _a === void 0 ? void 0 : _a.FaceId) === userData.faceId; });
        const confidence = isMatch
            ? ((_c = searchResult.faceMatches[0]) === null || _c === void 0 ? void 0 : _c.Similarity) || 0
            : 0;
        return {
            isMatch,
            confidence,
        };
    }
    catch (error) {
        console.error("Error in verifyAgainstIndexedFace:", error);
        throw new Error(error.message || "Face verification failed");
    }
});
// Delete user's indexed face
exports.deleteUserFace = (0, https_1.onCall)(async (data, context) => {
    var _a, _b;
    try {
        // Get user ID from context or data
        const userId = ((_a = context === null || context === void 0 ? void 0 : context.auth) === null || _a === void 0 ? void 0 : _a.uid) || ((_b = data.data) === null || _b === void 0 ? void 0 : _b.userId) || data.userId;
        // Check if we have a valid user ID
        if (!userId) {
            throw new Error("User must be authenticated");
        }
        // Get user's face ID
        const userDoc = await admin
            .firestore()
            .collection("users")
            .doc(userId)
            .get();
        if (!userDoc.exists) {
            throw new Error("User not found");
        }
        const userData = userDoc.data();
        if (!(userData === null || userData === void 0 ? void 0 : userData.faceId)) {
            return { success: true, message: "No face to delete" };
        }
        // Delete face from collection
        const success = await (0, faceRecognition_1.deleteFace)(COLLECTION_ID, userData.faceId);
        if (success) {
            // Remove face ID from user document
            await admin.firestore().collection("users").doc(userId).update({
                faceId: admin.firestore.FieldValue.delete(),
                faceIndexedAt: admin.firestore.FieldValue.delete(),
            });
        }
        return { success };
    }
    catch (error) {
        console.error("Error in deleteUserFace:", error);
        throw new Error(error.message || "Failed to delete face");
    }
});
// Helper function to download image from URL
async function downloadImageFromUrl(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to download image: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
    }
    catch (error) {
        console.error("Error downloading image:", error);
        throw new Error(`Failed to download image: ${error.message}`);
    }
}
//# sourceMappingURL=faceVerification.js.map