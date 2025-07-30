function obfs(s:string, key:number, n:number = 126) {
    // return String itself if the given parameters are invalid
    if (!(typeof(key) === 'number' && key % 1 === 0)) {
      return s.toString();
    }
  
    var chars = s.toString().split('');
  
    for (var i = 0; i < chars.length; i++) {
      var c = chars[i].charCodeAt(0);
  
      if (c <= n) {
        chars[i] = String.fromCharCode((chars[i].charCodeAt(0) + key) % n);
      }
    }
  
    return chars.join('');
  };


export const deObf = (s: string, key: number, n = 126) => {
    // return String itself if the given parameters are invalid
    if (!(typeof(key) === 'number' && key % 1 === 0)
        || !(typeof(key) === 'number' && key % 1 === 0)) {
        return s.toString();
    }

    return obfs(s.toString(), n - key);
}