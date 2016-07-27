// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform, $rootScope, $ionicGesture, $ionicPopover, $ionicPopup) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        $rootScope.clickInfo = [];
        var colorsPainted = [], paint;
        var context = document.getElementById('myCanvas').getContext("2d");
        var elem = document.getElementById('myCanvas');
        elem.width = elem.offsetWidth;
        elem.height = elem.offsetHeight;
        $rootScope.images = ['us_flag.png', 'cuban_flag.png', 'canadian_flag.jpg', 'italy_flag.png', 'mexican_flag.jpg', 'dominican_flag.jpg'];
        $rootScope.image = "";
        $rootScope.colors = ['white', 'beige', 'rosybrown', 'brown', 'maroon', 'darkmagenta', 'pink', 'magenta', 'red', 'orange', 'salmon', 'yellow', 'green', 'darkgreen', 'cyan', 'darkcyan', 'blue', 'lightgray', 'gray', 'black'];
        $rootScope.color = "black";
        $rootScope.eraseMode = false;
        $rootScope.lineWidth = 5;

        $ionicGesture.on('touch', function (e) {
            var mouseX = e.gesture.touches[0].pageX - elem.offsetLeft;
            var mouseY = e.gesture.touches[0].pageY - elem.offsetTop - 43;

            paint = true;
            addClick(mouseX, mouseY);
            redraw();
        }, angular.element(elem));

        $ionicGesture.on('drag', function (e) {
            if (paint) {
                addClick(e.gesture.touches[0].pageX - elem.offsetLeft, e.gesture.touches[0].pageY - elem.offsetTop - 43, true);
                redraw();
            }
        }, angular.element(elem));

        $ionicGesture.on('release', function (e) {
            paint = false;
        }, angular.element(elem));

        function addClick(x, y, dragging) {
            $rootScope.clickInfo.push({ x: x, y: y, dragging: dragging, lineWidth: $rootScope.lineWidth });
            colorsPainted.push($rootScope.color);
        }

        function redraw() {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
            paintBackground();
            //$rootScope.redrawImage();

            context.lineJoin = "round";
            for (var i = 0; i < $rootScope.clickInfo.length; i++) {
                context.lineWidth = $rootScope.clickInfo[i].lineWidth;
                context.strokeStyle = colorsPainted[i];
                context.beginPath();
                if ($rootScope.clickInfo[i].dragging && i) {
                    context.moveTo($rootScope.clickInfo[i - 1].x, $rootScope.clickInfo[i - 1].y);
                } else {
                    context.moveTo($rootScope.clickInfo[i].x - 1, $rootScope.clickInfo[i].y);
                }
                context.lineTo($rootScope.clickInfo[i].x, $rootScope.clickInfo[i].y);
                context.closePath();
                context.stroke();
            }
        }

        $rootScope.redrawImage = function () {
            if ($rootScope.image) {
                document.getElementById('image-bw').src = "img/" + $rootScope.image;
                var img = document.getElementById('image-bw');
                context.drawImage(img, 0, 0, elem.width, elem.height);
            }
        };

        $rootScope.setEraseMode = function () {
            //todo: implement a better way to erase the lines
            $rootScope.eraseMode = true;
            $rootScope.lineWidth = 40;
            $rootScope.color = 'white';
        };

        $rootScope.clearCanvas = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Clear Painting?',
                template: 'Are you sure you want to clear your painting?'
            });

            confirmPopup.then(function(res) {
                if(res) {
                    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                    $rootScope.clickInfo = [];
                    colorsPainted = [];
                    $rootScope.eraseMode = false;
                }
            });
        };

        $rootScope.openPencilDialog = function (e) {
            $rootScope.popoverP.show(e);
            $rootScope.repaintLine();
        };

        $rootScope.repaintLine = function (line) {
            var ctx = document.getElementById('thickness-canvas').getContext("2d");
            var img = document.getElementById('grid');
            ctx.drawImage(img, 0, 0);

            ctx.lineJoin = "round";
            ctx.lineWidth = line;
            ctx.strokeStyle = $rootScope.color;
            ctx.beginPath();
            ctx.moveTo(40, 80);
            ctx.lineTo(255, 80);
            ctx.closePath();
            ctx.stroke();
        };

        $rootScope.selectColor = function (e) {
            $rootScope.popoverC.show(e);
        };

        $rootScope.pickColor = function (index) {
            $rootScope.color = $rootScope.colors[index];
            if ($rootScope.eraseMode) {
                $rootScope.lineWidth = 5;
            }
            $rootScope.eraseMode = false;
            $rootScope.popoverC.hide();
        };
        
        $rootScope.applyPencil = function (line) {
            $rootScope.lineWidth = line;
            $rootScope.eraseMode = false;
            $rootScope.popoverP.hide();
        };

        $rootScope.drawImageOnCanvas = function (index) {
            $rootScope.image = $rootScope.images[index];
            redraw();
            $rootScope.popoverImages.hide();
        };

        $rootScope.selectImage = function (e) {
            $rootScope.popoverImages.show(e);
        };

        function savePaint() {
            // save canvas image as data url (png format by default)
            var dataURL = document.getElementById('myCanvas').toDataURL();

            var img = document.getElementById('canvasImg');
            img.src = dataURL.replace('image/png', 'image/octet-stream');
            window.location.href = img.src;
        }

        $ionicPopover.fromTemplateUrl('views/images_popover.html', {
            scope: $rootScope
        }).then(function(popover) {
            $rootScope.popoverImages = popover;
        });

        $ionicPopover.fromTemplateUrl('views/pencil_popover.html', {
            scope: $rootScope
        }).then(function(popover) {
            $rootScope.popoverP = popover;
        });

        $ionicPopover.fromTemplateUrl('views/color_popover.html', {
            scope: $rootScope
        }).then(function(popover) {
            $rootScope.popoverC = popover;
        });

        $rootScope.showSavePaintingConfirm = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Save Painting?',
                template: 'Your painting will be saved as an image in your device.'
            });

            confirmPopup.then(function(res) {
                if(res) {
                    savePaint();
                }
            });
        };

        function paintBackground() {
            context.beginPath();
            context.rect(0, 0, elem.width, elem.height);
            context.fillStyle = 'white';
            context.fill();
            //context.lineWidth = 7;
            //context.strokeStyle = 'black';
            //context.stroke();
        }

        (function () {
            // document.body.classList.remove('platform-ios');
            // document.body.classList.remove('platform-android');
            // document.body.classList.add('platform-ios');
            paintBackground();
        })();
    });
});
