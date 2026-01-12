function doGet() {
    return HtmlService.createTemplateFromFile('index')
        .evaluate()
        .setTitle('PDF to Google Slides (GAS Only)')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function createPresentationFromImages(images, fileName, folderUrl) {
    try {
        const pptName = fileName.replace('.pdf', '') + '_Converted';
        const presentation = SlidesApp.create(pptName);
        const slides = presentation.getSlides();

        // Move to specified folder if URL is provided
        if (folderUrl) {
            try {
                const folderId = extractFolderIdFromUrl(folderUrl);
                if (folderId) {
                    const file = DriveApp.getFileById(presentation.getId());
                    const folder = DriveApp.getFolderById(folderId);
                    folder.addFile(file);
                    DriveApp.getRootFolder().removeFile(file);
                }
            } catch (err) {
                console.error('Error moving file: ' + err.toString());
            }
        }

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

function extractFolderIdFromUrl(url) {
    const match = url.match(/[-\w]{25,}/);
    return match ? match[0] : null;
}
