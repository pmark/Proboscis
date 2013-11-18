var util = require("util");
var EventEmitter = require('events').EventEmitter;
var expect = require('chai').expect;
var proboscis = require('../proboscis');
var led1;
var led2;
var motion1;

util.inherits(led1, EventEmitter);
util.inherits(led2, EventEmitter);
util.inherits(motion1, EventEmitter);

describe('Proboscis', function() {

	describe('#addObserver', function() {
		before(function(done) {
			led1 = "Led1";
			led2 = "Led2";
			motion1 = "IR.Motion-1";
			proboscis.addObserver(led1, "on", motion1, "motionstarted");
			done();
		});
	
		it("sender should have 1 observer", function() {
			var observers = proboscis.observersForSender(motion1);
			expect(Object.keys(observers).length).to.equal(1);
		});
	});

	// describe('handleEvent', function() {
	// 	before(function(done) {
	// 		proboscis.addObserver(led1, "on", motion1, "motionstarted");
	// 		done();
	// 	});

	// 	it('should set state', function() {
	// 		motion1.emit("motionstarted");
	// 		expect(led1.state).to.equal("on");
	// 	});
	// });

})
