import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * DigitalOcean Spaces storage for CMS uploads.
 *
 * Spaces is S3-compatible, so the AWS SDK v3 client works against it directly.
 * IMPORTANT: the S3 client's `endpoint` must be the bare regional endpoint
 * (e.g. https://sfo3.digitaloceanspaces.com), NOT the bucket-subdomain URL
 * DO shows you for browsing a Space (e.g. https://<space>.sfo3.digitaloceanspaces.com) —
 * passing the bucket-subdomain form makes the SDK double-prefix the bucket
 * name and every request fails. That bucket-subdomain form (DO_ENDPOINT /
 * DO_CDN_ENDPOINT) IS the correct prefix for building public file URLs, so
 * it's used only for that, below.
 *
 * The "ngowebsites" Space is shared across multiple NGO sites, so every file
 * this site uploads is kept under the "SF" (Sankranthi Foundation) key
 * prefix to avoid collisions with other sites' files.
 */
const REGION = process.env.DO_DEFAULT_REGION ?? "sfo3";
const SPACE = process.env.DO_SPACE;
const API_ENDPOINT = `https://${REGION}.digitaloceanspaces.com`;
const PUBLIC_ENDPOINT =
  process.env.DO_CDN_ENDPOINT ||
  process.env.DO_ENDPOINT ||
  (SPACE ? `https://${SPACE}.${REGION}.digitaloceanspaces.com` : undefined);
const FOLDER = "SF";

let client: S3Client | null = null;

function getClient(): S3Client {
  if (!client) {
    const accessKeyId = process.env.DO_ACCESS_KEY_ID;
    const secretAccessKey = process.env.DO_SECRET_ACCESS_KEY;
    if (!accessKeyId || !secretAccessKey) {
      throw new Error(
        "DigitalOcean Spaces is not configured. Set DO_ACCESS_KEY_ID and DO_SECRET_ACCESS_KEY."
      );
    }
    client = new S3Client({
      endpoint: API_ENDPOINT,
      region: REGION,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return client;
}

/**
 * Uploads a file to the "SF/" folder of the Space and returns its public
 * (CDN-backed, if configured) URL.
 */
export async function uploadToSpaces(
  bytes: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  if (!SPACE) throw new Error("DO_SPACE is not configured.");
  if (!PUBLIC_ENDPOINT) throw new Error("No public endpoint configured for DigitalOcean Spaces.");

  const key = `${FOLDER}/${filename}`;
  await getClient().send(
    new PutObjectCommand({
      Bucket: SPACE,
      Key: key,
      Body: bytes,
      ContentType: contentType,
      ACL: "public-read",
    })
  );

  return `${PUBLIC_ENDPOINT}/${key}`;
}
