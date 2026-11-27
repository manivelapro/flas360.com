var anchorDrive = document.querySelectorAll('a[href*="drive.google.com"]');
            Array.prototype.forEach.call(anchorDrive, function(element, index) {
                element.href = element.href.replace("/file/d/", "/uc?export=download&id=").replace("/view?usp=sharing", "");
            });
