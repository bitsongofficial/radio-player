export const PLAYER_STATUS = {
  READY: 0,
  LOADING: 1,
  PLAY: 2,
  PAUSE: 3
};

export function toHHMMSS(data) {
  if (Infinity === data) {
    return `00:00`;
  }

  var sec_num = parseInt(data, 10); // don't forget the second param
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  if (hours !== "00") return hours + ":" + minutes + ":" + seconds;
  return minutes + ":" + seconds;
}

export const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Replace first char of string with uppercase version
 *
 * @param {String} word
 */
export const captialize = word => {
  if (typeof word !== "string") {
    return "";
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
};

/**
 * Replace the middle part of string with dots
 *
 * @param {String} str         string to truncate
 * @param {Number} displayed   number of char to show before and after truncation
 */
export const truncateString = (str, displayed = 8) => {
  return `${str.substring(0, displayed)}...${str.substring(
    str.length - displayed
  )}`;
};

/**
 * Format timestamp string as YYYY-mm-dd H:m:s
 *
 * @param {*} dateString timestamp to convert
 */
export const formatTimestamp = dateString => {
  const dt = new Date(dateString);

  const yyyy = dt.getUTCFullYear();
  let mm = dt.getUTCMonth() + 1;
  let dd = dt.getUTCDate();

  let h = dt.getUTCHours();
  let m = dt.getUTCMinutes();
  let s = dt.getUTCSeconds();

  if (mm < 10) {
    mm = `0${mm}`;
  }

  if (dd < 10) {
    dd = `0${dd}`;
  }

  if (h < 10) {
    h = `0${h}`;
  }

  if (m < 10) {
    m = `0${m}`;
  }

  if (s < 10) {
    s = `0${s}`;
  }

  return `${yyyy}-${mm}-${dd} ${h}:${m}:${s}`;
};

/**
 * Convert Date or String to since Now formatted string
 *
 * @param {Date, String} date date to convert
 */
export const timeSince = date => {
  if (typeof date === "string") {
    date = new Date(date);
  }

  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
};

/**
 * Find percentage value of number
 *
 * @param {Number} x    value to convert as percentage
 * @param {Number} total value
 * @param {Number} decimals optional rounding parameter
 */
export const pergentageOf = (x, total, decimals = 2) => {
  if (total === 0) {
    return 0;
  }
  return ((100 * x) / total).toFixed(decimals);
};
