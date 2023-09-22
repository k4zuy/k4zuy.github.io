$(document).ready(function() {

    $.getJSON('images.json', function(data) {
        data.images.forEach(function(image) {
            var imgElement = $('<img>').attr('src', 'images/' + image).attr('alt', image);
            
            // Set the image's random starting position
            var randomLeft = Math.random() * ($(window).width() - 100);  
            var randomTop = Math.random() * ($(window).height() - 100); 
            
            imgElement.css({
                left: randomLeft + 'px',
                top: randomTop + 'px',
                position: 'absolute'
            });

            imgElement.data('velocity', {
                dx: (Math.random() - 0.5) * 2,
                dy: (Math.random() - 0.5) * 2,
                dz: (Math.random() - 0.5) * 0.05
            });

            $('.image-container').append(imgElement);
        });

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

    function updateVelocities() {
        $(".image-container img").each(function() {
            var velocity = $(this).data('velocity');
            velocity.dx = (Math.random() - 0.5) * 2;
            velocity.dy = (Math.random() - 0.5) * 2;
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
