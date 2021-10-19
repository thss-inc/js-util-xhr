class XHR {
  static _getPayloadString(payload) {
    return typeof payload == 'string' ? payload : JSON.stringify(payload);
  }
  static _getPayloadObject(payload) {
    return typeof payload == 'object' ? payload : JSON.parse(payload);
  }

  static fetch (method, endpoint, payload, options, callback) {
    const serialize = (obj) => {
      if (typeof obj != 'object') {
        console.error('object passed is not object');

        return obj;
      }

      var str = [];
      for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
          str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
      }

      return str.join('&');
    };

    // normalize method
    method = String(method).toUpperCase();

    // handle headers
    let defaultHeaders = {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'Authorization': ''
    }
    let headers = options && options.headers ? Object.assign(defaultHeaders, options.headers) : defaultHeaders;

    // do actual call
    const controller = new window.AbortController();
    const signal = controller.signal;

    switch (method) {
      case 'GET':
        endpoint += (endpoint.indexOf('?') == -1 ? '?' : '&') + serialize(this._getPayloadObject(payload));
        fetch(endpoint, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache',
          headers,
          body: null,
          signal
        })
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          callback(response, null);
        })
        .catch((error, response) => {
          console.error('XHR error exception', error, response);
          console.dir(error);

          if (error.name == 'AbortError') {
              // just the user cancelling the request, not an actual error
              return;
          }

          if (callback) callback(response, error);
        })
        break;
      case 'POST':
      case 'PUT':
      case 'DELETE':
       fetch(endpoint, {
          method,
          mode: 'cors',
          cache: 'no-cache',
          headers,
          body: this._getPayloadString(payload),
          signal
        })
        .then((response) => {
          if (!response || !response.ok) {
            console.error('RESPONSE error exception', response);

            throw 'HTTP error: ' + response.statusText;
          }

          return response.json();
        })
        .then((response) => {
          callback(response, null);
        })
        .catch((error) => {
          if (error.name == 'AbortError') {
            // just the user cancelling the request, not an actual error
            return;
          }

          if (callback) callback(null, error);
        })
        break;
      default:
        console.error('XHR method ' + method + ' not supported. Sorry');

        return false;
    }

    return controller;
  }

  static abort(controller) {
    return controller.abort();
  }
}

export default XHR;