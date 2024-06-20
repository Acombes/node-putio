import putio from './src/putio';
import unzip from './src/unzip';

const [script, ...args] = process.argv.slice(2);

switch (script) {
  case 'poll': {
    putio(process.env.CLIENT_ID, process.env.CLIENT_SECRET, {
      zipDestination: process.env.ZIP_DESTINATION,
    });
    break;
  }

  case 'unzip': {
    unzip(process.env.ZIP_DESTINATION, process.env.UNZIP_DESTINATION, {
      cleanUp: args.includes('--cleanup'),
    });
    break;
  }

  default:
    break;
}