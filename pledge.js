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

	this.handlerGroups.push({successCb: s, errorCb: e, forwarder: new Deferral()});




	if(this.state === "resolved" || this.state === "rejected"){
		return this.callHandlers(this.value);
	}
	return this.handlerGroups[0].forwarder.$promise;
}

$Promise.prototype.callHandlers = function(value){
	var thisCall = this.handlerGroups.shift();
	if (this.state === "resolved"){
		if(typeof thisCall.successCb === "function"){
			var theValue = thisCall.forwarder.$promise.value
			theValue = thisCall.successCb(value);
			thisCall.forwarder.resolve(theValue);
		} else {

			thisCall.forwarder.resolve(value);
		}
	}
	else if (this.state === "rejected"){
		if(typeof thisCall.errorCb === "function"){
			var theValue = thisCall.forwarder.$promise.value
			theValue = thisCall.errorCb(value);
			thisCall.forwarder.resolve(theValue);
		} else {
			thisCall.forwarder.reject(value);
		}
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
