export const doTranslateLink = (text:string) => {
    text = text.replaceAll('/', '÷');
    let url = "https://translate.google.com/?source=gtx_c#auto/en/" + encodeURIComponent(text);
    window.open(url, '_nerdleTranslater');
  }
