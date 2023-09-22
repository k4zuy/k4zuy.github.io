$(document).ready(function() {

    $.getJSON('images.json', function(data) {
        data.images.forEach(function(image) {
            var imgElement = $('<img>').attr('src', 'images/' + image).attr('alt', image);
            imgElement.data('direction', randomDirection());
            $('.image-container').append(imgElement);
        });

        setInterval(updateDirections, 10000);  // Change direction every 10 seconds
        requestAnimationFrame(animateImages);
    });

    function randomDirection() {
        var angle = Math.random() * Math.PI * 2;  // Random angle
        var speed = Math.random() * 3 + 1;  // Random speed between 1 and 4
        return {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };
    }

    function updateDirections() {
        $(".image-container img").each(function() {
            $(this).data('direction', randomDirection());
        });
    }

    function animateImages() {
        $(".image-container img").each(function() {
            var $img = $(this);
            var pos = $img.position();
            var direction = $img.data('direction');

            var newLeft = pos.left + direction.x;
            var newTop = pos.top + direction.y;

            // Keep images within the viewport:
            if (newLeft < 0 || newLeft > $(window).width() - $img.width()) {
                direction.x = -direction.x;
            }
            if (newTop < 0 || newTop > $(window).height() - $img.height()) {
                direction.y = -direction.y;
            }

            $img.css('transform', `translate(${newLeft}px, ${newTop}px)`);
        });

        requestAnimationFrame(animateImages);  // Loop the animation
    }
});
