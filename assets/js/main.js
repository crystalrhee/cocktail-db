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
    	console.log(getapi);
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
          console.log("No result");
      });
    },
    parsedata: (data) => {
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
			app.displaydata(collection);	
		} else {
			console.log("no result");
			app.displaynoresult();
		}
    },
    displaydata: (collection) => {
    	for (var i = 0; i < collection.length; i++) {
    		var item = collection[i];
    		console.log(item);
    		$('<div/>', {
    			'class':'card',
    			'html': $('<img>', {
    				'src': item.strDrinkThumb
    			}).add($('<div>', {
    				'class':'meta',
    				'text': item.strDrink
    			})).add($('<h3>', {
    				'class':'name',
    				'text': item.idDrink + ": " + item.strDrink
    			}))
    		}).appendTo(".results-grid");
    	};
    },
    displaynoresult: () => {
    	$('<div/>', {
    			'class':'no-result',
    			'text': "No results found."
    		}).appendTo(".results-grid");
    },
    removeresult: () => {
    	$(".results-grid").empty();
    }
};

$(".option").click(function(e) {
	e.preventDefault();
	$(this).addClass("active").siblings().removeClass("active");
});

$(document).keypress(function(e) {
    if(e.which == 13) {
        app.build();
    }
});


$(document).ready(function() {
	app.init();
	// app.displaydata("blah");
});