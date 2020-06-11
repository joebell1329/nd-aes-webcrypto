# @joph-auth/nd-aes-webcrypto

`@joph-auth/nd-aes-webcrypto` is a simple, no dependency, library for encrypting plaintext with 256 bit AES-GCM encryption
and PBKDF2 derived keys.

This package uses the [web crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) 
and therefore can only be used where `window.crypto` and `window.crypto.subtle` are available.

For compatibility with the [NodeJS Crypto module](https://nodejs.org/api/crypto.html), 
you should use `@joph-auth/nd-aes-nodecrypto` instead.

**WARNING: This has been created solely for educational purposes and 
should not be used to encrypt sensitive data in real world applications.**

## Installing pre-built package

The package is published on npm and can be installed with

`npm install --save @joph-auth/nd-aes-webcrypto`

or

`yarn add @joph-auth/nd-aes-webcrypto`

The package contains 3 builds.
- `dist/lib-cjs` - Default - Built for CommonJS modules.
- `dist/lib-esm` - Built for ES2020 modules.
- `dist/web-bundle` - Bundled for direct use in browsers.

## Usage

### CommonJS
```javascript
const { encrypt, decrypt } = require('@joph-auth/nd-aes-webcrypto');

async function example() {
  const cipher = await encrypt('plain text', 'password');
  console.log(cipher);

  const decrypted = await decrypt(cipher, 'password');
  console.log(decrypted);
}
```

### ES Modules
```javascript
import { encrypt, decrypt } from '@joph-auth/nd-aes-webcrypto/dist/lib-esm';

async function example() {
  const cipher = await encrypt('plain text', 'password');
  console.log(cipher);

  const decrypted = await decrypt(cipher, 'password');
  console.log(decrypted);
}
```

### Web Bundle
For the web bundle simply copy the `dist/web-bundle/nd-aes-webcrypto.min.js` and `dist/web-bundle/nd-aes-webcrypto.min.js.map` files to your project and load in a script element.

This will instantiate the `window.ndAesCrypto` object.
```html
<html>
  <head>
    <title>No Dependency AES Web Crypto</title>
  </head>
  <body>
    <script src="path/to/nd-aes-webcrypto.min.js"></script>
    <script>
      ndAesCrypto.encrypt('plain text', 'password')
        .then(cipher => {
          console.log(cipher);
          return ndAesCrypto.decrypt(cipher, 'password');
        })
        .then(decrypted => {
          console.log(decrypted);
        });
    </script>
  </body>
</html>
```

### PBKDF2 iterations
It is possible to change the number of PBKDF2 iterations applied to the plaintext password.
The default is 10,000 iterations which is the minimum recommended by OWASP, however, this should be increased to the maximum possible whilst maintaining acceptable performance for your use case.

```javascript
async function example() {
    const cipher = await encrypt('plain text', 'password', 1000000);
    const decrypted = await decrypt(cipher, 'password', 1000000);
}
```

## Build from source
You can clone this repo and build manually.

Run `yarn` or `npm install` to install dev dependencies.

Scripts included in `package.json` are;
- `build:cjs` - Builds the library for CommonJS modules.
- `build:esm` - Builds the library for ES modules.
- `build:web` - Builds the un-minified web bundle.
- `build:web:min` - Builds the minified web bundle.
- `build` - Builds all of the above.
