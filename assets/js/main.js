var app = {
	init: () => {
		var getapi = "https://www.thecocktaildb.com/api/json/v1/1/";
		return getapi;
	},
	getinput: () => {
		var userquery = $(".search-input").val();
        return userquery;
	},
	gettype: () => {
		var searchtype = "";
		var type = $(".active").text();
		switch(type) {
			case "name":
				searchtype = "search.php?s=";
				break;
			case "ingredients":
				searchtype = "search.php?i=";
				break;
			case "id":
				searchtype = "lookup.php?i=";
				break;
			default:
				searchtype = "";
		}
		return searchtype;
	},
    build: () => {
    	var getapi = app.init();
    	getapi += app.gettype();
    	getapi += app.getinput();
    	app.getrequest(getapi);
    },
    getrequest: (query, type) => {
    	app.removeresult();
        fetch(query)
        .then(response => response.json())
        .then(data =>  {
        	app.parsedata(data);
        })
        .catch(function() {
            console.log("Error fetching");
            
        });
    },
    parsedata: (data) => {
        // console.log(data);
    	var type = $(".active").text();
    	var collection = {}
		switch(type) {
			case "ingredients":
				collection = data.ingredients;
				break;
			default:
				collection = data.drinks;
		}
		if (collection != null) {
            switch(type) {
                case "ingredients":
                    app.showingred(collection);
                    break;
                default:
                    app.displaydata(collection);
            }
		} else {
			app.displaynoresult();
		}
    },
    showingred: (collection) => {
        var item = collection[0];
        $("<div>", {
            "class": "container",
            "html": $("<h3>", {
                "text": item.strIngredient
            }).add($("<p>", {
                "text": item.strType
            })).add($("<p>", {
                "text": item.idIngredient
            })).add($("<p>", {
                "text": item.strDescription
            }))
        }).appendTo("#results");
    },
    displaydata: (collection) => {
        $("<div>", {
            "class": "results-grid",
        }).appendTo("#results");
    	for (var i = 0; i < collection.length; i++) {
    		var item = collection[i];
    		$("<a>", {
                "href": "#",
                "class":"show",
                "data": item,
                "aria-haspopup": "true",
                "html": $("<div>", {
                    "class": "card",
                    "html": $("<img>", {
                        "src": item.strDrinkThumb
                    }).add($("<div>", {
                        "class":"meta",
                        "text": item.strDrink
                    })).add($("<h3>", {
                        "class":"name",
                        "text": item.idDrink + ": " + item.strDrink
                    }))
    			})
    		}).appendTo(".results-grid");
    	};
    },
    displaynoresult: () => {
        $("<div/>", {
                "class":"no-result",
                "text": "No results found."
            }).appendTo(".results-grid");
    },
    createModal: (data) => {
        var isalcoholic = data.strAlcoholic;
        var category = data.strCategory;
        var name = data.strDrink;
        var image = data.strDrinkThumb;
        var instruction = data.strInstructions;

        $("<img>", {
            "src": image,
        }).add($("<h3>", {
            "text": name
        })).add($("<div>", {
            "class": "caption",
            "html": $("<p>", {
                "class": "isalcoholic",
                "text": isalcoholic
            }).add($("<p>", {
                "text": instruction
            }))
        })).appendTo(".modal");
    },
    removeModal: () => {
        $(".modal").empty();
    },
    removeresult: () => {
    	$("#results").empty();
    }
};


// click function
$(".option").click(function(e) {
	e.preventDefault();
	$(this).addClass("active").siblings().removeClass("active");
});

$(document).keypress(function(e) {
    if(e.which == 13) {
        app.build();
    }
});


// modal
$(document).on("click", ".show",function(e) {
    e.preventDefault();
    app.removeModal();
    app.createModal($(this).data());
    $(".mask").addClass("active");
});

function closeModal(){
    $(".mask").removeClass("active");
};

$(document).on("click", ".close, .mask",function(e) {
    e.preventDefault();
    closeModal();
});

// initialize
$(document).ready(function() {
	app.init();
});