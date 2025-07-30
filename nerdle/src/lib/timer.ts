export const secondsToHms = (timer:number):string => {
    //d = Number(d);
    const d = timer
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    if (h > 0) {
      return `${h}h ${m}m ${s}s`;
    } else {
      return `${m}m ${s}s`;
    }
  }