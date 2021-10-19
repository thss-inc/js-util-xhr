# XHR Utility

Thin wrapper around JavaScript's Fetch API, to make API calls.

## Installation

Install using Yarn—where the URL is this repo's URL and anything after `#` is a branch name or release:

```bash
yarn add https://github.com/thss-inc/js-util-xhr.git#v0.9.0 # install version 0.9
```

```bash
yarn add https://github.com/thss-inc/js-util-xhr.git#develop # install from develop branch
```

Omit for latest release:

```bash
yarn add https://github.com/thss-inc/js-util-xhr.git # install latest
```

## Usage

### XHR.fetch

This is the main method, used to fetch. Parameters are:

`XHR.fetch(method, endpoint, payload, options, callback)`, where:

- `method` is the HTTP method like `GET`, `POST`, `PUT`, or `DELETE`
- `endpoint` is the URL to call
- `payload` is a JavaScript object with the payload
- `options` is an array of options to pass, currently supporting `headers` only
- `callback` is a function that will get called on success/error

Simple example:

```js
import XHR from '@thss-inc/util-xhr';

const method = 'GET';
const endpoint = 'https://jsonplaceholder.typicode.com/todos';
const payload = {
  sort_by: 'id',
  sort_dir: 'asc'
};
const options = {
  headers: {
    'X-TEST': 123
  }
};

XHR.fetch(method, endpoint, payload, options, (response, error) => {
  console.log('API response', response);
  console.log('API error', error);
});
```

Using promises + controller to abort call:

```js
import XHR from '@thss-inc/util-xhr';

const method = 'GET';
const endpoint = 'https://jsonplaceholder.typicode.com/todos';
const payload = {
  sort_by: 'id',
  sort_dir: 'asc'
};
const options = {
  headers: {
    'X-TEST': 123
  }
};

let queue = {};
const key = `${method}_${endpoint}`;

const promise = new Promise((resolve, reject) => {
  if (queue[key]) {
    XHR.abort(queue[key]);
  }

  const controller = XHR.fetch(method, endpoint, payload, options, (response, error) => {
    if (error) {
      // aborting call is not an error
      if (error.code == error.ABORT_ERR) {
        resolve(null);
      }

      // even if status code is wrong, return response
      if (callback) {
        callback(response, error);
      }

      reject(error);
    }

    if (callback) {
      callback(response, error);
    }
    
    resolve(response);
  });
  
  queue[key] = controller;
});

```

### XHR.abort

Used to cancel API calls (ex., when navigating away from page).

Pass controller returned by `XHR.fetch`, ex.:

```js
import XHR from '@thss-inc/util-xhr';

const method = 'GET';
const endpoint = 'https://jsonplaceholder.typicode.com/todos';
const payload = {};
const options = {};

const controller = XHR.fetch(method, endpoint, payload, options);

XHR.abort(controller);
```


