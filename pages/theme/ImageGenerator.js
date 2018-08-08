/**
 * ImageGenerator
 *
 * Image Mapping guide:
 0 = one image is used for all variations
  1 = one image is used for 0 or 1 subtitles, a different image for 2 subtitles
  2 = one image is used for 0 or 2 subtitles, a different image for 1 subtitle
  3 = one image is used for 1 or 2 subtitles, a different image for 0 subtitles
  4 = a different image is used for each variation
*/
class ImageGenerator {

  constructor () {
    // default variable defines
    this.baseUrl = 'https://res.cloudinary.com/cotribute/image/upload/'
    this.v = 1000
    this.themes = [
      'movienight',
      'business',
      'hiking',
      'camping',
      'wedding',
      'church',
      'fitness',
      'bbq',
      'concert',
      'insidechurch',
      'dessert',
      'baptism',
      'christmas',
      'picnic',
      'easter',
      'africa',
      'coffee',
      'pool',
      'people',
      'beach',
      'kitchen'
    ]
  }

  generateChristmasThemes(title, subtitle1, subtitle2) {
    return ['1', '2', '3', '4', '5', '6'].map(id => ({
      iKnowWhatIAmDoing: true, // IMPORTANT - to stop the code below from going
      meta: {                  //             crazy and making assumptions.
        imageId: `thrivent/christmas-${id}`,
        imageVersion: 'v1511307985',
        theme: `Inspire_Christmas0${id}`,
        quality: 30,
        title,
        subtitle1,
        subtitle2
      }
    }))
  }

  generateNewYearsThemes(title, subtitle1, subtitle2) {
    return [
      {
        index: '1',
        version: 'v1511308203'
      },
      {
        index: '2',
        version: 'v1511308200'
      },
      {
        index: '3',
        version: 'v1511308202'
      },
      {
        index: '4',
        version: 'v1511308202'
      }
    ].map(item => ({
      iKnowWhatIAmDoing: true, // IMPORTANT - to stop the code below from going
      meta: {                  //             crazy and making assumptions.
        imageId: `thrivent/new-years-${item.index}`,
        imageVersion: item.version,
        theme: `Inspire_NewYears0${item.index}`,
        quality: 30,
        title,
        subtitle1,
        subtitle2
      }
    }))
  }

  availableThemes () {
    return this.themes
  }

  // Find all special characters, replace them with encoded values
  escapeSpecialChars (str, includeSlash = true) {
    // // NOTE: Needs work! Couldn't quite get 100% coverage, therefor sticking to dumb method
    // function escapeSpecial(str) {
    //   let escapeable = /([\'\’\!\@\#\:\$\%\^\&\*\,\)\(\+\=\.\_\-])/g
    //   let matches = str.match(escapeable)
    //   if (!matches || matches.length <= 0) return str;
    //
    //   // If we have matches, loop through and assign normalized value
    //   for (var i = 0; i < matches.length; i++) {
    //     let item = matches[i]
    //     let itemNormal = encodeURIComponent(item)
    //     let itemFixed = itemNormal.replace('%', '%25').replace('%2525', '%25') // add cloudinary delimiter
    //     let rgx = new RegExp(item, 'g')
    //     str = str.replace(rgx, `${itemFixed}`)
    //   }
    //
    //   // Special Cases
    //   str = str.replace(/%25E2%2580%2599/g, '\'')
    //
    //   return str
    // }

    if (str) {
      // Necessary to have a good baseline
      str = this.descapeSpecialChars(str, includeSlash)
      str = encodeURI(str)
      str = str.replace(/,/g, '%252C')
                .replace(/:/g, '%253A')
                .replace(/!/g, '%2521')
                .replace(/\?/g, '%253F')
                .replace(/@/g,  '%2540')
                .replace(/#/g,  '%2523');

      if(includeSlash){
        str = str.replace(/\//g, '%252F');// NOTE: This causes issues in other parts of the URI
      }

      //  Remove emojis
      str = str.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '')
    }

    return str
  }

  // In case it got stored with URL Encoded chars
  // Find all special characters, replace them with normalized values
  descapeSpecialChars (str, includeSlash = true) {
    if (str) {
      // NOTE: Needs work! Couldn't quite get 100% coverage, therefor sticking to dumb method
      // let descapeable = /(%25[A-Za-z0-9]{0,2})/g
      // let matches = str.match(descapeable)
      // if (!matches || matches.length <= 0) return str;
      //
      // // If we have matches, loop through and assign normalized value
      // for (var i = 0; i < matches.length; i++) {
      //   let item = matches[i]
      //   let itemFixed = item.replace('%25', '%').replace('%2525', '%') // strip cloudinary delimiter
      //   let itemNormal = decodeURIComponent(itemFixed)
      //   let rgx = new RegExp(item, 'g')
      //   str = str.replace(rgx, `${itemNormal}`)
      // }
      //
      // str = decodeURI(str)

      str = str.replace(/%252C/g, ',')
                .replace(/%253A/g, ':')
                .replace(/%2521/g, '!')
                .replace(/%253F/g, '?')
                .replace(/%2523/g, '#')
                .replace(/%2540/g, '@');
              //  .replace(/%252F/g, '/') // NOTE: This causes issues in other parts of the URI
      if(includeSlash){
          str = str.replace(/%252F/g, '/');// NOTE: This causes issues in other parts of the URI
      }
    }

    return str
  }


  // This is kinda complex, sorry bout that :/
  // Here's an example of expected data:
  // {
  //   theme: 'movienight',
  //   title: '',
  //   quality: 80,
  //   subtitle1: '',
  //   subtitle2: '',
  //   imageId: '', (Optional)
  //   imageVersion: '' (Optional)
  // }
  //I added image to all getFallbackImage to work correctly this logic seem to be incorrect. (ML)
  generateTheme (image, options = {}) {
    //
    if (!options || !options.title || !options.theme) {
      return this.getFallbackImage(image);
    }
    let meta = this.getMeta(options)
    let titleMain =  (meta.title) ? `$title_!${meta.title}!` : '';
    let subtitle1 = (meta.subtitle1) ? `,$subtitle1_!${meta.subtitle1}!` : ''
    let subtitle2 = (meta.subtitle2) ? `,$subtitle2_!${meta.subtitle2}!` : ''

    // If no first subtitle, default to second if second
    if (!subtitle1 && subtitle2) {
      subtitle1 = `,$subtitle1_!${this.escapeSpecialChars(meta.subtitle2)}!`
      subtitle2 = ''
    }

    let baseVariation = (!subtitle1 && !subtitle2) ? 0 : (subtitle1 && !subtitle2) ? 1 : 2
    let imagePath = `v${meta.imageVersion}/${meta.imageId}`
    let themeSupport = (baseVariation === 0) ? 'nosubtitle' : `${baseVariation}subtitle${(baseVariation === 2) ? 's' : ''}`
    let quality = (options.quality) ? `/q_${options.quality}` : '/q_80'
    let finalPath = `${this.baseUrl}${titleMain}${subtitle1}${subtitle2}/t_${meta.theme}_theme_${themeSupport}${quality}/${imagePath}.jpg`
    finalPath = finalPath.replace('/vv', '/v')

    return finalPath;
  }

  /**
   * getMeta
   * returns image meta and theme
   */
  getMeta (options) {
    if (!options || !options.title || !options.theme) {
        return { src: this.getFallbackImage(options) };
    }
    let theme = options.theme;

    let custom = options.custom ? true : false;

    if (typeof options.title === 'string' && options.title.indexOf('%20') !== -1) {
      options.title = decodeURIComponent(options.title)
    }

    if (typeof options.subtitle1 === 'string' && options.subtitle1.indexOf('%20') !== -1) {
      options.subtitle1 = decodeURIComponent(options.subtitle1)
    }

    if (typeof options.subtitle2 === 'string' && options.subtitle2.indexOf('%20') !== -1) {
      options.subtitle2 = decodeURIComponent(options.subtitle2)
    }

    let title = this.escapeSpecialChars(options.title);
    let subtitle1 = (options.subtitle1) ? `${this.escapeSpecialChars(options.subtitle1)}` : null
    let subtitle2 = (options.subtitle2) ? `${this.escapeSpecialChars(options.subtitle2)}` : null
    let baseVariation = (!subtitle1 && !subtitle2) ? 0 : (subtitle1 && !subtitle2) ? 1 : 2
    let imageId = (options.imageId) ? `${this.escapeSpecialChars(options.imageId, false)}` : `imaginary/${theme}_theme_image${baseVariation}`
    let imageVersion = options.imageVersion || this.v
    return {
      theme,
      title,
      subtitle1,
      subtitle2,
      imageId,
      imageVersion,
      custom
    }
  }

  /**
   * getImageData
   * returns image data for specified image, meta and theme
   */
  getImageData (image) {
    let meta = this.getMeta(image.meta ? image.meta : image)
    let src = this.generateTheme(image, image.meta ? image.meta : image)
    meta.src = src;
    meta.width = 1600;
    meta.height = 800;
    if(image.meta && image.meta.custom){
      meta.custom = true;
    }
    return {
      imageId: meta.imageId || image.imageId,
      imageVersion: meta.imageVersion || image.imageVersion,
      sort: 0,
      status: 'active',
      description: '',
      meta: meta
    }
  }

  /*

  */
  getImageURL(image) {
    if (!image || !image.imageVersion || !image.imageId) {
      return 'https://cotribute.s3.amazonaws.com/p/images/no-image.svg';
    }
    let imagePath = `v${image.imageVersion}/${image.imageId}`;
    let finalPath = `${this.baseUrl}${imagePath}.png`;
    finalPath = finalPath.replace('/vv', '/v');

    return finalPath;
  }
  /**
   * getFallbackImage
   * returns fallback image data for specified image, meta and theme
   */
  getFallbackImage (image) {
    if (!image || !image.imageVersion || !image.imageId) {
      return 'https://cotribute.s3.amazonaws.com/p/images/no-image.svg';
    }
    let imagePath = image.iKnowWhatIAmDoing ?
      `${image.imageVersion}/${image.imageId}` :
      `t_event_theme_crop_main/v${image.imageVersion}/${image.imageId}`;
    let finalPath = `${this.baseUrl}${imagePath}.jpg`;
    finalPath = finalPath.replace('/vv', '/v');

    return finalPath;
  }

  /**
   * createFallbackImage
   * returns fallback image data for specified title
   */
  createFallbackImage (title = '') {
    title = (title.length > 0) ? title.substring(0, 20) + '...' : title
    title = title.replace(/\,|\&|\*|\$|\%/g, '')
    let imagePath = `v1472835706/orange_xf31c8` // NOTE: Could change to dynamic backgrounds?
    return `${this.baseUrl}l_text:Arial_145_bold:${title},co_white/${imagePath}.jpg`
  }

}
export default ImageGenerator;
