const TOTAL_IMAGES_TO_DISPLAY = 40;
const IMAGE_CHANGE_INTERVAL = 30000;  // Change a few images every 30 seconds

let allImages = [];
let currentDisplayedImages = [];

$(document).ready(function() {

    $.getJSON('images.json', function(data) {
        allImages = data.images;
        addRandomImages();

        setInterval(changeRandomImages, IMAGE_CHANGE_INTERVAL);
        setInterval(updateVelocities, 10000); // Change velocity every 10 seconds
        animateImages();
    });

    $(document).on('click', '.image-container img', function() {
        var src = $(this).attr('src');
        $('#modalImage').attr('src', src);
        $('#imageModal').show();
    });

    function closeModal() {
        $('#imageModal').hide();
    }

    function addRandomImages() {
        let imagesToAdd = getRandomElements(allImages, TOTAL_IMAGES_TO_DISPLAY - currentDisplayedImages.length);
        imagesToAdd.forEach(function(image) {
            var imgElement = createImageElement(image);
            $('.image-container').append(imgElement);
            currentDisplayedImages.push(image);
        });
    }

    function changeRandomImages() {
        // Here, let's replace 5 images. Adjust as needed.
        for (let i = 0; i < 5; i++) {
            if ($('.image-container img').length) {
                let randomIndex = Math.floor(Math.random() * $('.image-container img').length);
                let $randomImage = $($('.image-container img')[randomIndex]);
                
                // Remove the old image from the currentDisplayedImages array
                let indexOfImage = currentDisplayedImages.indexOf($randomImage.attr('alt'));
                if (indexOfImage > -1) {
                    currentDisplayedImages.splice(indexOfImage, 1);
                }
                
                $randomImage.remove();
            }
        }

        addRandomImages();
    }

    function getRandomElements(arr, count) {
        let shuffled = arr.slice(0);
        let i = arr.length;
        let temp;
        let index;
        while (i--) {
            index = Math.floor(i * Math.random());
            temp = shuffled[i];
            shuffled[i] = shuffled[index];
            shuffled[index] = temp;
        }
        return shuffled.slice(0, count);
    }

    function createImageElement(imageName) {
        var imgElement = $('<img>').attr('src', 'images/' + imageName).attr('alt', imageName);
        
        // ... [rest of the imgElement initialization code]

        return imgElement;
    }

    // ... [rest of the code, e.g., updateVelocities, animateImages]
});
