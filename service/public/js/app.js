const CookieManager = {
  banner: document.querySelector(".govuk-cookie-banner"),
  buttons: document.querySelectorAll(".govuk-cookie-banner .govuk-button"),
  banner_name: "cookie_banner_seen",
  preference_name: "cookie_preferences",
  cookie_preferences: {
    analytics: false, seen: false, essential: true
  },
  init: function () {
    if (!this.hasCookie(this.preference_name)) {
      this.setCookie(this.preference_name, this.cookie_preferences, { expires: 0 });
    }

    const self = this;
    this.buttons.forEach(button => {
      button.addEventListener("click", (e) => {
        const userResponse = e.target.value;

        if (e.target.value == "hide") {
          self.banner.remove();
          return;
        }

        if (self.hasOwnProperty(userResponse)) {
          self[`${userResponse}`](self);
        }

      });
    });
  },

  /**
   * Accept analytical cookies
   */
  accept: (scope) => {
    const value = scope.getCookie(scope.preference_name);
    value.analytics = true;
    value.seen = true;

    scope.setCookie(scope.preference_name, value, { expires: 0 });
    scope.banner.querySelector("#cookie-banner-message").setAttribute("hidden", true);
    scope.banner.querySelector("#cookie-banner-accept").removeAttribute("hidden");
  },

  /**
   * Reject analytical cookies
   */
  reject: (scope) => {
    const value = scope.getCookie(scope.preference_name);
    value.analytics = false;
    value.seen = true;

    scope.setCookie(scope.preference_name, value, { expires: 0 });
    scope.banner.querySelector("#cookie-banner-message").setAttribute("hidden", true);
    scope.banner.querySelector("#cookie-banner-reject").removeAttribute("hidden");
  },

  /**
   * Check if a cookie to allow analytics has been set to true
   * @returns {boolean}
   */
  allowAnalytics: () => {
    if (!this.hasCookie(this.cookie_preferences)) {
      return false;
    }

    this.getCookie(this.preference_name).analytics = true;
    return this.getCookie(this.preference_name).analytics
  },

  /**
   * Set a cookie with the given name and value and other optional parameters.
   */
  setCookie: (name, value, options = {}) => {
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }

    options = {
      path: "/", // add other defaults here if necessary
      ...options
    };

    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
      updatedCookie += "; " + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
      }
    }

    document.cookie = updatedCookie + ";secure";
  },

  /**
   * Get the value of the cookie with the given name.
   */
  getCookie: (name) => {
    let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
    return matches ? JSON.parse(decodeURIComponent(matches[1])) : undefined;
  },

  /**
   * Determine if a cookie with the given name exists.
   */
  hasCookie: (name) => {
    return document.cookie.indexOf(name + "=") !== -1;
  }
};


document.querySelectorAll("input[type=\"checkbox\"][value=\"any\"]").forEach((checkbox) => {
  if (checkbox.checked) {
    checkbox.parentElement.parentElement.querySelectorAll("input[type=\"checkbox\"]:not([value=\"any\"])").forEach((child) => {
      child.checked = false;
      child.disabled = true;
    });
  }

  checkbox.addEventListener("change", (e) => {
    const { checked, name } = e.target;
    document.querySelectorAll(`input[name="${name}"]`).forEach((currentCheckbox) => {
      if (currentCheckbox.value !== "any") {
        currentCheckbox.disabled = checked;
        currentCheckbox.checked = false;
      }
    });
  });
});


CookieManager.init();

