$(document).ready(function() {
    // Fetch the JSON data and populate the images
    $.getJSON('images.json', function(data) {
        data.images.forEach(function(image) {
            var imgElement = $('<img>').attr('src', 'images/' + image).attr('alt', image);
            $('.image-container').append(imgElement);
        });
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
        $img.css('top', newPos[0] + 'px');
        $img.css('left', newPos[1] + 'px');
    }

    setTimeout(function() {
        $(".image-container img").each(function() {
            moveImage($(this));
        });
    }, 200);  // give some time for images to load before moving

    setInterval(function() {
        $(".image-container img").each(function() {
            moveImage($(this));
        });
    }, 1000);  
});
