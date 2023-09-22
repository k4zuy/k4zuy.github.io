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
        let countToReplace = 5; // Number of images to replace
        for (let i = 0; i < countToReplace && $('.image-container img').length; i++) {
            let randomIndex = Math.floor(Math.random() * $('.image-container img').length);
            let $randomImage = $($('.image-container img')[randomIndex]);
            
            let indexOfImage = currentDisplayedImages.indexOf($randomImage.attr('alt'));
            if (indexOfImage > -1) {
                currentDisplayedImages.splice(indexOfImage, 1);
            }
            
            $randomImage.remove();
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
        
        var randomLeft = Math.random() * ($(window).width() - 150);  
        var randomTop = Math.random() * ($(window).height() - 150); 
        imgElement.css({
            left: randomLeft + 'px',
            top: randomTop + 'px',
            position: 'absolute'
        });

        imgElement.data('velocity', {
            dx: (Math.random() - 0.5) * 0.5,  // Even slower movement
            dy: (Math.random() - 0.5) * 0.5,
            dz: (Math.random() - 0.5) * 0.02
        });
        
        return imgElement;
    }

    function updateVelocities() {
        $(".image-container img").each(function() {
            var velocity = $(this).data('velocity');
            velocity.dx = (Math.random() - 0.5) * 0.5;  // Even slower movement
            velocity.dy = (Math.random() - 0.5) * 0.5;
        });
    }

    function animateImages() {
        $(".image-container img").each(function() {
            var $img = $(this);
            var pos = $img.position();
            var velocity = $img.data('velocity');
            
            var newLeft = pos.left + velocity.dx;
            var newTop = pos.top + velocity.dy;
            
            // Adjustments to keep images within the viewport
            if (newLeft < 0) newLeft = 0;
            if (newLeft > $(window).width() - $img.width()) newLeft = $(window).width() - $img.width();
            
            if (newTop < 0) newTop = 0;
            if (newTop > $(window).height() - $img.height()) newTop = $(window).height() - $img.height();

            var newZ = velocity.dz + ($img.data('z') || 1);
            if (newZ < 0.5 || newZ > 1.5) {
                velocity.dz = -velocity.dz;
                newZ += velocity.dz;
            }
            var scaleValue = newZ;
            $img.data('z', newZ);
            $img.css('transform', 'scale(' + scaleValue + ')');
            $img.css('z-index', Math.round(scaleValue * 100));

            $img.css({
                left: newLeft + 'px',
                top: newTop + 'px'
            });
        });

        requestAnimationFrame(animateImages);
    }
});
