import { createWriteStream } from 'fs';
import { access, mkdir } from 'fs/promises';
import { Readable } from 'stream';
import type { ReadableStream } from 'stream/web';
import PutioAPI, { ISearchResponse } from '@putdotio/api-client';

export default async function putio(
  clientId: string,
  clientSecret: string,
  options?: Partial<{
    zipDestination: string;
  }>
) {
  if (!clientId || !clientSecret) {
    return;
  }

  if (options.zipDestination) {
    try {
      await access(options.zipDestination);
    } catch (e) {
      await mkdir(options.zipDestination, { recursive: true });
    }
  }

  const putioApi = new PutioAPI({ clientID: +clientId });
  putioApi.setToken(clientSecret);

  const files = await putioApi.get<ISearchResponse>('/files/list', { params: { parent_id: 0 } }).then(({ data }) => data.files);
  const zipsData = await Promise.all(
    files.map(file =>
      putioApi.Zips
        .Create({ ids: [file.id] })
        .then(({ data: createdZip }) =>
          putioApi.Zips
            .Get(createdZip.zip_id)
            .then(({ data }) => ({ fileName: file.name, zipId: createdZip.zip_id, zip: data }))
        )
    )
  );

  const zipUrls = Object.fromEntries(
    await putioApi.Zips
      .Query()
      .then(({ data }) =>
        Promise.all(data.zips.map(zip =>
          putioApi.Zips
            .Get(zip.id)
            .then(({ data }) => [zip.id, data.url])
        ))
      )
  );

  zipsData.forEach(zip => {
    const zipName = `${zip.fileName}.zip`;
    // FIXME sometimes the ZIP URL is `null`...
    console.log(`Downloading ${zipName} from ${zipUrls[zip.zipId]}`)
    const file = createWriteStream(options?.zipDestination ? `./${options.zipDestination}/${zipName}` : zipName);
    fetch(zipUrls[zip.zipId])
      .then(({ body }) => {
        Readable.fromWeb(body as ReadableStream<any>).pipe(file);
        console.log(`Downloaded: ${zipName}`);
      });
  });
}
