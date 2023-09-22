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
        
        // Set random starting position and velocity for each image
        var randomLeft = Math.random() * ($(window).width() - 100);  
        var randomTop = Math.random() * ($(window).height() - 100); 
        imgElement.css({
            left: randomLeft + 'px',
            top: randomTop + 'px',
            position: 'absolute'
        });

        imgElement.data('velocity', {
            dx: (Math.random() - 0.5) * 1,  // Slower movement
            dy: (Math.random() - 0.5) * 1,
            dz: (Math.random() - 0.5) * 0.05
        });
        
        return imgElement;
    }

    function updateVelocities() {
        $(".image-container img").each(function() {
            var velocity = $(this).data('velocity');
            velocity.dx = (Math.random() - 0.5) * 1;  // Slower movement
            velocity.dy = (Math.random() - 0.5) * 1;
        });
    }

    function animateImages() {
        $(".image-container img").each(function() {
            var $img = $(this);
            var pos = $img.position();
            var velocity = $img.data('velocity');
            
            var newLeft = pos.left + velocity.dx;
            var newTop = pos.top + velocity.dy;
            
            // Keep images within the viewport and reverse direction if it hits an edge
            if (newLeft < 0 || newLeft > $(window).width() - $img.width()) {
                velocity.dx = -velocity.dx;
                newLeft = pos.left + velocity.dx;
            }
            if (newTop < 0 || newTop > $(window).height() - $img.height()) {
                velocity.dy = -velocity.dy;
                newTop = pos.top + velocity.dy;
            }

            // Implementing the 3D-like effect
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

        requestAnimationFrame(animateImages);  // Keep the animation running
    }
});
