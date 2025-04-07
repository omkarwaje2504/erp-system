import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME;
const awsRegion = process.env.NEXT_PUBLIC_AWS_S3_REGION;
const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;
const s3 = new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function GenerateFilePath(fileName) {
  return `sample/production/photos/${fileName}`;
}

const UploadFile = async (imageData, fileName, type) => {
  const contentType =
    {
      image: "image/png",
      video: "video/mp4",
      audio: "audio/wav",
      file: "application/pdf",
    }[type] || null;

  if (!contentType) throw new Error("Unsupported file type");
  if (!accessKeyId || !secretAccessKey)
    throw new Error("AWS credentials missing");

  const filePath = await GenerateFilePath(fileName);
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: filePath,
    Body: imageData,
    ACL: "public-read",
    ContentType: contentType,
  });

  await s3.send(command);
  return createS3Url({ name: filePath });
};

export const createS3Url = ({ name }) =>
  `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${name}`;

export const DeleteFile = async (name) => {
  const filePath = await GenerateFilePath(name);
  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: filePath,
      })
    );
    return true;
  } catch (err) {
    console.error("Deletion error:", err);
    return false;
  }
};

export default UploadFile;
