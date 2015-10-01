/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:
var $Promise = function(){
	this.state = "pending";
};
var Deferral = function(){
	this.$promise = new $Promise();
};

Deferral.prototype.resolve = function(someValue){
	if (this.$promise.state === "pending"){
		this.$promise.value = someValue;
		this.$promise.state = "resolved";		
	}
}

Deferral.prototype.reject = function(someReason){
	if (this.$promise.state === "pending"){
		this.$promise.value = someReason;
		this.$promise.state = "rejected";		
	}
}

var defer = function(){
	return new Deferral();
}


/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = {
  defer: defer,
};

So in a Node-based project we could write things like this:

var pledge = require('pledge');
…
var myDeferral = pledge.defer();
var myPromise1 = myDeferral.$promise;
--------------------------------------------------------*/
