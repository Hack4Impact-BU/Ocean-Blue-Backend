const express = require("express");
const router = express.Router();

// Middleware.
const auth = require("./middleware/auth");

// Image Upload Initialization.
const multer = require('multer');
//TODO: Look into placing more restrictions on size limits, file size etc.
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).array('images');
const { Readable } = require('stream');

// Azure Blob Storage Initialization.
const { BlobServiceClient, StorageSharedKeyCredential, newPipeline } = require('@azure/storage-blob');
const containerName = process.env.AZURE_CONTAINER_NAME;
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };
const sharedKeyCredential = new StorageSharedKeyCredential(
    process.env.AZURE_STORAGE_ACCOUNT_NAME,
    process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY);
const pipeline = newPipeline(sharedKeyCredential);
const blobServiceClient = new BlobServiceClient(
    `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
    pipeline
);

// Helper function to generate a filename.
const generateBlobName = (originalName) => {
    // Use a random number to generate a unique file name, 
    // removing "0." from the start of the string.
    const identifier = Math.random().toString().replace(/0\./, '');
    return `${identifier}-${originalName}`;
};

// Upload images into Azure Blob Storage.
// Returns an array of imageURIs as a response.
router.post("/uploadImages", [auth, uploadStrategy], async (req, res) => {
    // try {
    //     // Create array of images' Azure URIs to return.
    //     let imageAzureURIs = [];

    //     const containerClient = blobServiceClient.getContainerClient(containerName);
    
    //     await req.files.forEach(async (file, i) => {
    //         // Generate a random filename to store in Azure Blob.
    //         let blobName = generateBlobName(file.originalname);

    //         // Generate the Azure URI for the image and add it to the list.
    //         let imageAzureURI = `https:${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${process.env.AZURE_CONTAINER_NAME}/${blobName}`;
    //         imageAzureURIs = [...imageAzureURIs, imageAzureURI];

    //         // Upload each image to Azure Blob Storage
    //         let stream = Readable.from(file.buffer);
    //         let blockBlobClient = containerClient.getBlockBlobClient(blobName);
    //         await blockBlobClient.uploadStream(
    //             stream,
    //             uploadOptions.bufferSize, 
    //             uploadOptions.maxBuffers,
    //             { blobHTTPHeaders: { blobContentType: file.mimetype } }
    //         );
    //     });

    //     res.status(200).json(imageAzureURIs);

    // } catch (err) {
    //     console.log(err);
    //     res.status(500).json(err);
    // }

    res.status(200).json("testing");
})

module.exports = router;