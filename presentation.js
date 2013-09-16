// # Beyond AMD
// ## Extending javascript
//
// ### There are 3 common ways to extend javascript
//
// 1. Instance extension
//    * Similar to the way jQuery, Backbone, and underscore works. This is where you extend a
//    global instance of something ie; `$, Backbone, _`
//
// 2. Factory extension (Duck punching, Proxy Pattern)
//    * This type of extension is used on factory functions, when you need to extend something that has not been created yet
//
// 3. A "plugin model"
//    * This is where you build your own custom plugin model (Slick grid, iron.js)
//

// </br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br>
(function(){  })();

// ### AMD (Async Module Definition) makes writing extensible javascript "easier"
//
// AMD lets you define dependencies up front while you are developing your modules. 
// This make adding extension points easier. 
// </br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br>
define("derp", function () {
   return "derp";
});
define("herp",["derp"], function (derp){

  return {
     herp: derp
  }

});

// ### But... AMD is not quite enough
//
// AMD is mearly service location, it's not inverting control (IoC)
//
// </br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br>
(function(){  })();

// # 1. Instance extension
//
// * jQuery plugins
//  
//    [https://github.com/scottgonzalez/jquery-ui-extensions ](https://github.com/scottgonzalez/jquery-ui-extensions )
(function($) {

  $.fn.herpderp = function (options) {
     /* do cool stuff */
  }

  $(function() {
     $(".herps").herpderp();
  });

})(jQuery);
// * Backbone js
//    
//    [http://backbonejs.org ](http://backbonejs.org )
// 
var MyView = Backbone.View.extend({
    initialize: function(params) {
       /* do stuff */
    },
    events : {
       "click .herps" : "onHerp"
    }
});

window.MyView = new MyView();

// * Underscore
//    
//   [http://underscorejs.org ](http://underscorejs.org )
//
//
// </br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br>
 var _ = function(obj) { return new wrapper(obj); };

_.invoke = function(obj, method) {
  var args = slice.call(arguments, 2);
  return _.map(obj, function(value) {
    return (_.isFunction(method) ? method || value : value[method]).apply(value, args);
  });
};

var derps = [{herp:function(){}}];

_.invoke(derps, "herp", "derp");
 
// # 2. Factory extension
//
// * Duck punching
//  
//    [https://github.com/scottgonzalez/jquery-ui-extensions ](https://github.com/scottgonzalez/jquery-ui-extensions )
//    [http://wiki.jqueryui.com/w/page/12138135/Widget-factory](http://wiki.jqueryui.com/w/page/12138135/Widget-factory)
// </br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br>
// </br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br>
/* simplier method */
(function( $ ) {

$.ui.dialog.prototype.options.autoReposition = true;
$( window ).resize(function() {
    $( ".ui-dialog-content:visible" ).each(function() {
        var dialog = $( this ).data( "dialog" );
        if ( dialog.options.autoReposition ) {
            dialog.option( "position", dialog.options.position );
        }
    });
});

})( jQuery );


/* advanced method */
(function( $ ) {


var proto = $.ui.autocomplete.prototype,
	initSource = proto._initSource;

function filter( array, term ) {
	var matcher = new RegExp( $.ui.autocomplete.escapeRegex(term), "i" );
	return $.grep( array, function(value) {
		return matcher.test( $( "<div>" ).html( value.label || value.value || value ).text() );
	});
}

$.extend( proto, {
	_initSource: function() {
		if ( this.options.html && $.isArray(this.options.source) ) {
			this.source = function( request, response ) {
				response( filter( this.options.source, request.term ) );
			};
		} else {
			initSource.call( this );
		}
	},

	_renderItem: function( ul, item) {
		return $( "<li></li>" )
			.data( "item.autocomplete", item )
			.append( $( "<a></a>" )[ this.options.html ? "html" : "text" ]( item.label ) )
			.appendTo( ul );
	}
});

})( jQuery );


// # 3. Build your own plugin API
//
//  
//    [https;//github.com/DarthfubuMVC/jquery-continuations](https://github.com/DarthFubuMVC/jquery-continutations)
//    [https;//github.com/mleibman/SlickGrid](https://github.com/mleiben/SlickGrid)
// </br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br>
(function($) {
  var policies = [];

  var refreshPolicy = function () {
    this.matches = function (continuation) {
      return continuation.refresh && continuation.refresh.toString() === 'true';
    };
    this.execute = function (continuation) {
      $.continuations.windowService.refresh();
    };
  };

  var continuations = function () { 
    this.callbacks = {};
  };
  continuations.prototype = {
    setupDefaults: function () {
      this.applyPolicy(new refreshPolicy());
    },
    applyPolicy: function (policy) {
      policies.push(policy);
      return this;
    },
    init : function () {
      this.setupDefaults();
    },
    process: function (continuation) {
      var standardContinuation = new $.continuations.continuation();
      continuation = $.extend(standardContinuation, continuation);
      var matchingPolicies = [];
      for (var i = 0; i < policies.length; ++i) {
        var p = policies[i];
        if (p.matches(continuation)) {
          matchingPolicies.push(p);
        }
      }

      for (var i = 0; i < matchingPolicies.length; ++i) {
        matchingPolicies[i].execute(continuation);
      }
    }
  }

})(jQuery);

// Slick grid

function SlickGrid(container, data, columns, options) {

  var self = this;
  var plugins = [];

  function init() {
      /* do crazy stuff */
  }

  function registerPlugin(plugin) {
    plugins.unshift(plugin);
    // Notice how each plugin is given self!
    // Awesome
    plugin.init(self);
  }

  function unregisterPlugin(plugin) {
    for (var i = plugins.length; i >= 0; i--) {
      if (plugins[i] === plugin) {
        if (plugins[i].destroy) {
          plugins[i].destroy();
        }
        plugins.splice(i, 1);
        break;
      }
    }
  }

  $.extend(this, {
    "slickGridVersion": "2.0",

    "registerPlugin": registerPlugin,
    "unregisterPlugin": unregisterPlugin
  });

  init();
}

// Lets write a plugin
(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "Plugins": {
        "HeaderMenu": HeaderMenu
      }
    }
  });

  function HeaderMenu(options) {
    var _grid;

    function init(grid) {
      _grid = grid;
    }

    function destroy(){

    }

    $.extend(this, {
      "init": init,
      "destory": destroy
    })
  }
})(jQuery)


var grid = new Slick.Grid("#myGrid", data, columns, options);

var headerMenuPlugin = new Slick.Plugins.HeaderMenu({});

grid.registerPlugin(headerMenuPlugin);



// #OK now lets talk about AMD
//
// AMD in a nutshell is define
/* foo.js */
define(function() {

  /* return something */

});

// AMD can return anything!
//
// return an object
/* foo.js */
define(function() {

  /* return something */
  return {
    herp: "derp"
  }

});

// return a instance of a function
/* foo.js */
define(function() {

  /* return something */
  var derp = function () {};

  return new derp();

});

// return a function
/* foo.js */
define(function() {

  /* return something */
  var derp = function () {};

  return derp;

});

// return a string
/* foo.js */
define(function() {

  /* return something */
  return "herp derp";

});


// ask for dependencies
// </br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br>
/* foo.js */
define(["herp"],function(herp) {

  /* return something */
  return herp;

});

// ## So whats wrong with AMD?
//
// What if I need to modify foo?
// </br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br>
requirejs.config({
   paths: {
     "oldFoo": "foo",
     "foo": "newFoo"
   }
});

define("newFoo", ["oldFoo"], function(foo) {
   return foo + "bar";
});

define("foo",function(){
   return "foo";   
});

console.log(require("foo"));

// ## Let's go Beyond AMD!
//
// We need a new global!
// We need IoC
// </br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br>

extend("foo", function () {
  return function(foo){
      return foo + "bar";
  };
});




// AMD extend examples
//
// jQuery plugin example
// </br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br>
extend('jquery', function() {
	return function($) {
		$.fn.myplugin = function () {/*...*/}
		return $;
	}
});

define("fooView", ["jquery"], function ($) {
	return {
		init: function () {
			$("#view").myplugin({/*..*/});
		},
		destory: function () {
			$("#view").empty();
		}
	}
});


// backbone view 
extend("backboneView", ["jquery","underscore","backbone"], function ($, _, Backbone) {

	var extendedView = Backbone.View.extend({/* ... */});

	return function (bbView) {
		var oldRender = bbView.prototype.render;
		bbView.prototype.render = function () {
			var rendered = oldRender.call(this,arguments);
			var myView = new extendedView();
			this.on("someevent", function () {
				myView.trigger("someotherevent");
			});
			return rendered;			
		}
		return bbView;
	}
});

define("backboneView", ["jquery","underscore","backbone"], function ($, _, Backbone) {

	var bbView = Backbone.View.extend({
		render: function () {
			/* do stuff */
			return this;
		}
	});
	return bbView;
});


// policies example
define("jquery", function () {
  return {
    post: function (url, data, callback) {
      callback( {
        successful: true, 
        error: true, 
        message: "yo dawg!"
      });
    }
  };
});

define("messagebus", function () {
  return {
    publish : function (topic, data) {
      console.log(topic, data);
    }
  }
});

extend("policies", function () {
	return function (policies){
		var policy = {
			matches : function (context) {
				/* always execute */
				return true;
			},
			execute : function (data) {
				console.log("data:received", data);
			}
		}
		policies.push(policy);
		return policies;
	}; 
});

extend("policies",["messagebus"], function (bus) {
	return function (policies){
		var policy = {
			matches : function (context) {
				/* only execute when */
				return context.successful;
			},
			execute : function (data) {

				bus.publish("successful", data); 
			}
		}
		policies.push(policy);
		return policies;
	}; 
});
extend("policies",["messagebus"], function (bus) {
	return function (policies){
		var policy = {
			matches : function (context) {
				/* only execute when */
				return context.error;
			},
			execute : function (data) {

				bus.publish("failure", data); 
			}
		}
		policies.push(policy);
		return policies;
	}; 
});

define("policies", function () {
	return [];
});



define("fooModel",["jquery","policies"], function ($, policies) {
	return {
		save: function (attributes) {
			$.post("/foo", attributes,function (data) {
				policies.forEach(function(policy) {
					if(policy.matches(data)){
						policy.execute(data);
					}
				});
			});
		}
	};
});
