
exports.board = {
	motion1: {
		type: "IR.Motion", 
		pin: 7
	},
	led1: {
		type: "Led", 
		pin: 11
	},
	led2: {
		type: "Led",
		pin: 13
	}	
};

exports.triggers = {
	motion1: {
		motionstart: {
			led1: "on"
		},
		motionend: {
			led1: "off"
		}
	},

	led1: {
		on: {
			led2: "off"
		},
		off: {
			led2: "on"
		}
	}
};

