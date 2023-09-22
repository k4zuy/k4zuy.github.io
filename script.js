const TOTAL_IMAGES_TO_DISPLAY = 40;
const IMAGE_CHANGE_INTERVAL = 30000; // Change a few images every 30 seconds

$(document).ready(function() {

    // Fetching the images from images.json and appending them to the .image-container
    $.getJSON('images.json', function(data) {
        let allImages = data.images;
        let selectedImages = getRandomElements(allImages, TOTAL_IMAGES_TO_DISPLAY);

        selectedImages.forEach(appendImage);

        setInterval(() => {
            changeRandomImages(allImages);
        }, IMAGE_CHANGE_INTERVAL);

        setInterval(updateVelocities, 10000); // Change velocity every 10 seconds
        animateImages();
    });

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

    function appendImage(image) {
        var imgElement = $('<img>').attr('src', 'images/' + image).attr('alt', image);
        var randomLeft = Math.random() * ($(window).width() - 100); 
        var randomTop = Math.random() * ($(window).height() - 100);
        
        imgElement.css({
            left: randomLeft + 'px',
            top: randomTop + 'px',
            position: 'absolute'  
        });

        imgElement.data('velocity', getRandomVelocity());
        $('.image-container').append(imgElement);
    }

    function changeRandomImages(allImages) {
        let countToReplace = 5; // Number of images to replace
        let currentImages = $('.image-container img').map((_, img) => $(img).attr('alt')).get();
        let newImages = allImages.filter(img => !currentImages.includes(img));
        
        for (let i = 0; i < countToReplace && $('.image-container img').length; i++) {
            let randomIndex = Math.floor(Math.random() * $('.image-container img').length);
            $($('.image-container img')[randomIndex]).remove();
        }

        let imagesToAdd = getRandomElements(newImages, countToReplace);
        imagesToAdd.forEach(appendImage);
    }

    function getRandomVelocity() {
        return {
            dx: (Math.random() - 0.5) * 4,
            dy: (Math.random() - 0.5) * 4
        };
    }

    function updateVelocities() {
        $(".image-container img").each(function() {
            $(this).data('velocity', getRandomVelocity());
        });
    }

    function pauseImage() {
        var $img = $(this);
        $img.data('paused', true);
    }

    function resumeImage() {
        var $img = $(this);
        $img.data('paused', false);
    }

    function animateImages() {
        $(".image-container img").each(function() {
            var $img = $(this);
            
            if ($img.data('paused')) return;

            var pos = $img.position();
            var velocity = $img.data('velocity');
            
            var newLeft = pos.left + velocity.dx;
            var newTop = pos.top + velocity.dy;

            if (newLeft < 0 || newLeft > $(window).width() - $img.width()) {
                velocity.dx = -velocity.dx;
                newLeft = pos.left + velocity.dx;
            }
            if (newTop < 0 || newTop > $(window).height() - $img.height()) {
                velocity.dy = -velocity.dy;
                newTop = pos.top + velocity.dy;
            }

            $img.css({
                left: newLeft + 'px',
                top: newTop + 'px'
            });
        });

        requestAnimationFrame(animateImages);
    }

    $(document).on('click', '.image-container img', function() {
        var src = $(this).attr('src');
        $('#modalImage').attr('src', src);
        $('#imageModal').show();
    });

    $(document).on('click', '.modal-close', closeModal);
    function closeModal() {
        $('#imageModal').hide();
    }

    $(document).on('mouseover', '.image-container img', pauseImage);
    $(document).on('mouseout', '.image-container img', resumeImage);
});
