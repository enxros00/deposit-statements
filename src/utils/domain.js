const domain = () => {
    let domain = "";
    if (window.location.hostname === 'localhost') {
      domain = import.meta.env.VITE_REACT_APP_API_DEV_DOMAIN_INTERNET;
    } else {
      switch (window.location.origin) {
        case window._env_.NFEAPP_UI_URL_INTRANET:
          domain = window._env_.NFEAPP_API_URL_INTRANET;
          break;
        default:
          domain = window._env_.NFEAPP_API_URL_INTERNET;
          break;
      }
      domain += "/";
    }
    return domain;
}

export { domain } 