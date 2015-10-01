/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:
var $Promise = function(){
	this.value = null;
	this.state = "pending";
	this.handlerGroups = [];
};

$Promise.prototype.then = function(success, error){
	var s, e;
	if(typeof success === 'function' ){
		s = success;
	} 

	if(typeof error === 'function'){
		e = error;
	}

	this.handlerGroups.push({successCb: s, errorCb: e});

	if(this.state === "resolved" || this.state === "rejected"){
		return this.callHandlers(this.value);
	}
}

$Promise.prototype.callHandlers = function(value){
	var thisCall = this.handlerGroups.shift();
	if (this.state === "resolved" && typeof thisCall.successCb === "function"){
		return thisCall.successCb(value);
	}
	else if (this.state === "rejected" && typeof thisCall.errorCb === "function"){
		return thisCall.errorCb(value);
	}
	
}

$Promise.prototype.catch = function(errorFn){
	return this.then(null, errorFn);
}

var Deferral = function(){
	this.$promise = new $Promise();
};

Deferral.prototype.resolve = function(someValue){
	if (this.$promise.state === "pending"){
		this.$promise.value = someValue;
		this.$promise.state = "resolved";
		while(this.$promise.handlerGroups.length > 0){
			this.$promise.callHandlers(this.$promise.value);
		}	
	}
}

Deferral.prototype.reject = function(someReason){
	if (this.$promise.state === "pending"){
		this.$promise.value = someReason;
		this.$promise.state = "rejected";
		while(this.$promise.handlerGroups.length > 0){
			this.$promise.callHandlers(this.$promise.value);
		}		
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
