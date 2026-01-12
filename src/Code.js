function doGet() {
    return HtmlService.createTemplateFromFile('index')
        .evaluate()
        .setTitle('PDF to Google Slides (GAS Only)')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function createPresentationFromImages(images, fileName) {
    let presentationId;
    try {
        const pptName = fileName.replace('.pdf', '') + '_Converted';
        const presentation = SlidesApp.create(pptName);
        presentationId = presentation.getId();
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

        presentation.saveAndClose();

        // Export as PPTX
        const url = "https://docs.google.com/presentation/d/" + presentationId + "/export/pptx";
        const options = {
            headers: {
                Authorization: "Bearer " + ScriptApp.getOAuthToken()
            }
        };
        const response = UrlFetchApp.fetch(url, options);
        const pptxBlob = response.getBlob();

        // Cleanup: Delete temporary Slides file
        DriveApp.getFileById(presentationId).setTrashed(true);

        return {
            base64: Utilities.base64Encode(pptxBlob.getBytes()),
            fileName: pptName + ".pptx"
        };
    } catch (e) {
        if (presentationId) {
            DriveApp.getFileById(presentationId).setTrashed(true);
        }
        throw new Error('Error: ' + e.toString());
    }
}
