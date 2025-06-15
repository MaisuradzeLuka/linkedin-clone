import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
} from "@azure/storage-blob";

const accountName = process.env.AZURE_STORAGE_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

if (!accountKey || !accountName)
  throw new Error("Couldnt find account key or account name");

const sharedKeyCredentials = new StorageSharedKeyCredential(
  accountName,
  accountKey
);

export const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredentials
);

export async function generateWriteSASToken(containerName: string) {
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const permissions = new BlobSASPermissions();
  permissions.write = true;
  permissions.create = true;
  permissions.delete = true;

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName: containerClient.containerName,
      permissions: permissions,
      expiresOn: new Date(Date.now() + 5 * 60 * 1000),
    },
    sharedKeyCredentials
  ).toString();

  return sasToken;
}

export async function generateBlobSASUrl(
  blobName: string | null,
  containerName: string
) {
  if (!blobName) return;

  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);

  const expiresOn = new Date(new Date().valueOf() + 30 * 60 * 1000);
  const startsOn = new Date(Date.now() - 5 * 60 * 1000);

  const permissions = new BlobSASPermissions();
  permissions.read = true;
  permissions.delete = true;

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions,
      startsOn,
      expiresOn,
    },
    sharedKeyCredentials
  ).toString();

  const sasUrl = `${blobClient.url}?${sasToken}`;
  return sasUrl;
}
