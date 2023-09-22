$(document).ready(function() {

    $.getJSON('images.json', function(data) {
        data.images.forEach(function(image) {
            var imgElement = $('<img>').attr('src', 'images/' + image).attr('alt', image);
            imgElement.data('velocity', getRandomVelocity());
            $('.image-container').append(imgElement);
        });

        setInterval(updateVelocities, 10000); // Change velocity every 10 seconds
        animateImages();
    });

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
});
