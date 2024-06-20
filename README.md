# Node put.io

Provides scripts to poll & unzip ZIP archives of available files on your [put.io](https://put.io) account.

## Installation
Install NPM dependencies:
```bash
npm ci
```

Create `.env` file at the project root. It should contain the following variables:
```dotenv
CLIENT_ID=<your-client-id>
CLIENT_SECRET=<your-oauth-token>

ZIP_DESTINATION=<destination-of-downloaded-archives>
UNZIP_DESTINATION=<destination-of-unzipped-archives>
```

The Client ID & Client Secret can be found here https://app.put.io/oauth after you've created an App.

## Documentation
The following NPM scripts are available:
* `get-zips`: fetch all the ZIP archives of all files available at the root of your put.io account.
* `get-unzip`: fetches all the ZIP archives then unzips them.
* `get-unzip:cleanup`: fetches all the ZIP archives, unzips them, then deletes the ZIP sources.
* `unzip`: unzips all the ZIP archives that are present in the provided `ZIP_DESTINATION` path.
* `unzip:cleanup`: unzips all the ZIP archives that are present in the provided `ZIP_DESTINATION` path then deletes the source archives.
