$(document).ready(function() {

    // Fetching the images from images.json and appending them to the .image-container
    $.getJSON('images.json', function(data) {
        data.images.forEach(function(image) {
            var imgElement = $('<img>').attr('src', 'images/' + image).attr('alt', image);
            imgElement.data('velocity', getRandomVelocity());
            $('.image-container').append(imgElement);
        });

        setInterval(updateVelocities, 10000); // Change velocity every 10 seconds
        animateImages();
    });

    // Function to generate random velocity for the images
    function getRandomVelocity() {
        return {
            dx: (Math.random() - 0.5) * 4,
            dy: (Math.random() - 0.5) * 4
        };
    }

    // Function to update the velocities of the images
    function updateVelocities() {
        $(".image-container img").each(function() {
            $(this).data('velocity', getRandomVelocity());
        });
    }

    // Function to animate the images on the screen
    function animateImages() {
        $(".image-container img").each(function() {
            var $img = $(this);
            var pos = $img.position();
            var velocity = $img.data('velocity');
            
            var newLeft = pos.left + velocity.dx;
            var newTop = pos.top + velocity.dy;

            // Keep images within the viewport and reverse direction if it hits an edge:
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

        requestAnimationFrame(animateImages);  // Keep the animation running
    }

    // Event to open the modal when an image is clicked
    $(document).on('click', '.image-container img', function() {
        var src = $(this).attr('src');
        $('#modalImage').attr('src', src);
        $('#imageModal').show();
    });

    // Function to close the modal
    $(document).on('click', '.modal-close', closeModal);
    function closeModal() {
        $('#imageModal').hide();
    }
});
