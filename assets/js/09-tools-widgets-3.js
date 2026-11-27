$("").ready(function() {
                $("#Ifont").click(function() {
                    curSize = parseInt($(".postBody").css("font-size")) + 1,
                    curSize <= 20 && $(".postBody").css("font-size", curSize)
                }),
                $("#Dfont").click(function() {
                    curSize = parseInt($(".postBody").css("font-size")) - 1,
                    curSize >= 10 && $(".postBody").css("font-size", curSize)
                })
            });
