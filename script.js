$(document).ready(function() {

    $.getJSON('images.json', function(data) {
        data.images.forEach(function(image) {
            var imgElement = $('<img>').attr('src', 'images/' + image).attr('alt', image);
            $('.image-container').append(imgElement);
        });

        setInterval(moveAllImages, 5000);  // New position every 5 seconds, matching the CSS transition
    });

    function randomPosition() {
        var h = $(window).height() - 100;
        var w = $(window).width() - 100;
        var newHeight = Math.floor(Math.random() * h);
        var newWidth = Math.floor(Math.random() * w);
        return [newHeight, newWidth];
    }

    function moveImage($img) {
        var newPos = randomPosition();
        $img.css('transform', 'translate(' + newPos[1] + 'px, ' + newPos[0] + 'px)');
    }

    function moveAllImages() {
        $(".image-container img").each(function() {
            moveImage($(this));
        });
    }
});
