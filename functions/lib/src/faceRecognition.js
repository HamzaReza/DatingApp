"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFace = exports.searchFaces = exports.indexFace = exports.createFaceCollection = exports.compareFaces = exports.detectFaces = void 0;
const AWS = require("aws-sdk");
// Configure AWS
AWS.config.update({
    region: process.env.AWS_REGION || "us-east-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const rekognition = new AWS.Rekognition();
/**
 * Detect faces in an image and return face information
 */
const detectFaces = async (imageBuffer) => {
    try {
        const params = {
            Image: {
                Bytes: imageBuffer,
            },
            Attributes: ["ALL"],
        };
        const result = await rekognition.detectFaces(params).promise();
        if (result.FaceDetails && result.FaceDetails.length > 0) {
            const face = result.FaceDetails[0];
            return {
                facesDetected: result.FaceDetails.length,
                faceId: face.FaceId,
                confidence: face.Confidence || 0,
            };
        }
        return {
            facesDetected: 0,
            error: "No faces detected in the image",
        };
    }
    catch (error) {
        console.error("Error detecting faces:", error);
        return {
            facesDetected: 0,
            error: error.message || "Failed to detect faces",
        };
    }
};
exports.detectFaces = detectFaces;
/**
 * Compare two faces using AWS Rekognition
 */
const compareFaces = async (sourceImageBuffer, targetImageBuffer, similarityThreshold = 80) => {
    try {
        const params = {
            SourceImage: {
                Bytes: sourceImageBuffer,
            },
            TargetImage: {
                Bytes: targetImageBuffer,
            },
            SimilarityThreshold: similarityThreshold,
        };
        const result = await rekognition.compareFaces(params).promise();
        if (result.FaceMatches && result.FaceMatches.length > 0) {
            const match = result.FaceMatches[0];
            return {
                isMatch: true,
                confidence: match.Similarity || 0,
            };
        }
        return {
            isMatch: false,
            confidence: 0,
            error: "No matching faces found",
        };
    }
    catch (error) {
        console.error("Error comparing faces:", error);
        return {
            isMatch: false,
            confidence: 0,
            error: error.message || "Failed to compare faces",
        };
    }
};
exports.compareFaces = compareFaces;
/**
 * Create a face collection for storing face IDs
 */
const createFaceCollection = async (collectionId) => {
    try {
        const params = {
            CollectionId: collectionId,
        };
        await rekognition.createCollection(params).promise();
        return true;
    }
    catch (error) {
        if (error.code === "ResourceAlreadyExistsException") {
            return true; // Collection already exists
        }
        console.error("Error creating face collection:", error);
        return false;
    }
};
exports.createFaceCollection = createFaceCollection;
/**
 * Index a face in the collection
 */
const indexFace = async (collectionId, imageBuffer, externalImageId) => {
    var _a;
    try {
        const params = {
            CollectionId: collectionId,
            Image: {
                Bytes: imageBuffer,
            },
            ExternalImageId: externalImageId,
        };
        const result = await rekognition.indexFaces(params).promise();
        if (result.FaceRecords && result.FaceRecords.length > 0) {
            return {
                faceId: (_a = result.FaceRecords[0].Face) === null || _a === void 0 ? void 0 : _a.FaceId,
            };
        }
        return {
            error: "No face found to index",
        };
    }
    catch (error) {
        console.error("Error indexing face:", error);
        return {
            error: error.message || "Failed to index face",
        };
    }
};
exports.indexFace = indexFace;
/**
 * Search for faces in a collection
 */
const searchFaces = async (collectionId, imageBuffer, maxFaces = 1, faceMatchThreshold = 80) => {
    try {
        const params = {
            CollectionId: collectionId,
            Image: {
                Bytes: imageBuffer,
            },
            MaxFaces: maxFaces,
            FaceMatchThreshold: faceMatchThreshold,
        };
        const result = await rekognition.searchFacesByImage(params).promise();
        return {
            faceMatches: result.FaceMatches || [],
        };
    }
    catch (error) {
        console.error("Error searching faces:", error);
        return {
            faceMatches: [],
            error: error.message || "Failed to search faces",
        };
    }
};
exports.searchFaces = searchFaces;
/**
 * Delete a face from collection
 */
const deleteFace = async (collectionId, faceId) => {
    try {
        const params = {
            CollectionId: collectionId,
            FaceIds: [faceId],
        };
        await rekognition.deleteFaces(params).promise();
        return true;
    }
    catch (error) {
        console.error("Error deleting face:", error);
        return false;
    }
};
exports.deleteFace = deleteFace;
//# sourceMappingURL=faceRecognition.js.map