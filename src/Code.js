function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('PDF to Google Slides (GAS Only)')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function createPresentationFromImages(images, fileName) {
  try {
    const pptName = fileName.replace('.pdf', '') + '_Converted';
    const presentation = SlidesApp.create(pptName);
    const slides = presentation.getSlides();
    
    images.forEach((base64Data, index) => {
      const data = base64Data.split(',')[1];
      const blob = Utilities.newBlob(
        Utilities.base64Decode(data), 
        'image/png', 
        'slide-' + index + '.png'
      );
      
      let slide;
      if (index === 0) {
        slide = slides[0];
        slide.getPageElements().forEach(e => e.remove());
      } else {
        slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
      }
      slide.getBackground().setPictureFill(blob);
    });

    return presentation.getUrl();
  } catch (e) {
    throw new Error('Error: ' + e.toString());
  }
}
