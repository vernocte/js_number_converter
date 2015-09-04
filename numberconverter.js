	/********************************************************************\
		 ___     ___     ___     ___     ___     ___
	 ___/   \___/   \___/   \___/   \___/   \___/   \___
	/   \___/   \___/   \___/   \___/   \___/   \___/   \
	\___/   \___/   \___/   \___/   \___/   \___/   \___/
	/   \___/                                   \___/   \
	\___/         _  _  __      __    ____          \___/
	/   \        ( \/ )(  )    /__\  (  _ \         /   \
	\___/         \  /  )(__  /(__)\  ) _ <         \___/
	/   \          \/  (____)(__)(__)(____/         /   \
	\___/                                           \___/
	/   \___  js number converter version &beta; ___/   \
	\___/   \___     ___     ___     ___     ___/   \___/
	/   \___/   \___/   \___/   \___/   \___/   \___/   \
	\___/   \___/   \___/   \___/   \___/   \___/   \___/
		\___/   \___/   \___/   \___/   \___/   \___/

    Copyright (C) 2015 - Robba Jurij - vernocte@gmail.com

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see http://www.gnu.org/licenses/.

	\********************************************************************/

	/********************************************************************\
			┌┐┬┬ ┬┌┬┐┬┐ ┌─┐┬─┐   ┌─┐┌─┐┌┐┬┬  ┬┌─┐┬─┐┌┬┐┌─┐┬─┐
			││││ ││││├┴┐├─ ├┬┘   │  │ ││││└┐┌┘├─ ├┬┘ │ ├─ ├┬┘
			┴└┘└─┘┴ ┴┴─┘└─┘┴└─   └─┘└─┘┴└┘ └┘ └─┘┴└─ ┴ └─┘┴└─
	\********************************************************************/
	
	/*
	# js number converter v0.0.0-beta #

	Initial beta release of JavaScript number converter library. 

	## Currently supported bases ##
	* 2 (binary)
	* 8 (octal)
	* 10 (decimal)
	* 16 (hex)
	* 32 (base 32, RFC 4648)
	* 64 (base 32)

	## Possible usages ## 
		
		NumberConverter["binary"]["decimal"]('11010'); // converts 11010 from binary to decimal (26)
		NumberConverter.binary.hex('11010'); // converts 11010 from binary to hex (1a)
		
		If we only need to convert from some base (lets say hex) we can use:
		
		var hex = new HexConverter(); // gives new hex converter named hex;
		hex["binary"]('1a'); // this returns '1 1010' (as string, some functions use white space for transparency in output)
		hex["decimal"]('1a'); // this returns '26' (as string)

	## Features ##
	* Library works with strings and has no upper limit for number length.

	## Notes ##
	* Base 32 converter only uses lower case letters, it will ignore upper case. If needed add .toLowerCase() to input. On same note, all converters to base 32 also yield results with lower case letters.
	* Unrecognized signs get ignored. make sure your input is what you want it to be
	* Especially when returning binary, converters will use white spaces ' ' remove them with .replace(/\s/g, '') if needed.
	* Converters return based on a value in a sense that they do not add 0 at the beginning or end and they do not use padding (=)
	*/

var NumberConverter = {
	binary: new BinaryConverter(),
	octal: new OctalConverter(),
	decimal: new DecimalConverter(),
	hex: new HexConverter(),
	base32: new Base32Converter(),
	base64: new Base64Converter()
};

	/********************************************************************\
			┬┐  ┬ ┌┐┬┌─┐┬─┐┬ ┬   ┌─┐┌─┐┌┐┬┬  ┬┌─┐┬─┐┌┬┐┌─┐┬─┐
			├┴┐ │ │││├─┤├┬┘└┬┘   │  │ ││││└┐┌┘├─ ├┬┘ │ ├─ ├┬┘
			┴─┘ ┴ ┴└┘┴ ┴┴└─ ┴    └─┘└─┘┴└┘ └┘ └─┘┴└─ ┴ └─┘┴└─
	\********************************************************************/

 function BinaryConverter() {

	// binary to binary
	this.binary = function(number) {
		"use strict";
		if(number==="") {
			return "";
		}
		number = number.replace(/^[0\s]+/, '');
		if(number==="") {
			return "0";
		}
		return number;
	};

	// binary to octal
	this.octal = function(number) {
		"use strict";
		number = number.replace(/\s/g, '');
		if(number==="") {
			return "";
		}
		var octal = "";
		while(number.length >= 3) {
			var temp = number.substring(number.length-3,number.length);
			number = number.substring(0, number.length-3);
			for(var j=0; j<8; ++j) {
				if(binary_tables.octal_binary[j][1] == temp) {
					octal = binary_tables.octal_binary[j][0] + octal;
					break;
				}
			}
		}
		if(number.length!==0) {
			number = "0" + number;
			if(number.length!=3) {
				number = "0" + number;
			}
			for(var k=0; k<8; ++k) {
				if(binary_tables.octal_binary[k][1] == number) {
					octal = binary_tables.octal_binary[k][0] + octal;
					break;
				}
			}
		}
		octal = octal.replace(/^[0\s]+/, '');
		if(octal==="") {
			return "0";
		}
		return octal;
	};

	// binary to decimal
	this.decimal = function(number) {
		"use strict";
		number = number.replace(/\s/g, '');
		if(number==="") {
			return "";
		}
		if(number === "") {
			return "";
		}
		var decimal = "0";
		var stage = "1";
		for(var i=0; i<number.length; ++i) {
			if(number[number.length-i-1]=="1") {
				decimal = NString.add(decimal, stage);
			}
			stage = NString.multiplybytwo(stage);
		}
		decimal = decimal.replace(/^[0\s]+/, '');
		if(decimal==="") {
			return "0";
		}
		return decimal;
	};

	// binary to hex
	this.hex = function(number) {
		"use strict";
		number = number.replace(/\s/g, '');
		if(number==="") {
			return "";
		}
		var hex = "";
		while(number.length >= 4) {
			var temp = number.substring(number.length-4,number.length);
			number = number.substring(0, number.length-4);
			for(var j=0; j<16; ++j) {
				if(binary_tables.hex_binary[j][1] == temp) {
					hex = binary_tables.hex_binary[j][0] + hex;
					break;
				}
			}
		}
		if(number.length!==0) {
			number = "0" + number;
			while(number.length<4) {
				number = "0" + number;
			}
			for(var k=0; k<16; ++k) {
				if(binary_tables.hex_binary[k][1] == number) {
					hex = binary_tables.hex_binary[k][0] + hex;
					break;
				}
			}
		}
		hex = hex.replace(/^[0\s]+/, '');
		if(hex==="") {
			return "0";
		}
		return hex;
	};

	// binary to base 32
	this.base32 = function(number) {
		"use strict";
		number = number.replace(/\s/g, '');
		if(number==="") {
			return "";
		}
		var base32 = "";
		while(number.length >= 5) {
			var temp = number.substring(number.length-5,number.length);
			number = number.substring(0, number.length-5);
			for(var j=0; j<32; ++j) {
				if(binary_tables.base32_binary[j][1] == temp) {
					base32 = binary_tables.base32_binary[j][0] + base32;
					break;
				}
			}
		}
		if(number.length!==0) {
			number = "0" + number;
			while(number.length<5) {
				number = "0" + number;
			}
			for(var k=0; k<32; ++k) {
				if(binary_tables.base32_binary[k][1] == number) {
					base32 = binary_tables.base32_binary[k][0] + base32;
					break;
				}
			}
		}
		base32 = base32.replace(/^[a\s]+/, '');
		if(base32==="") {
			return "a";
		}
		return base32;
	};

	// binary to base 64
	this.base64 = function(number) {
		"use strict";
		number = number.replace(/\s/g, '');
		if(number==="") {
			return "";
		}
		var base64 = "";
		while(number.length >= 6) {
			var temp = number.substring(number.length-6,number.length);
			number = number.substring(0, number.length-6);
			for(var j=0; j<64; ++j) {
				if(binary_tables.base64_binary[j][1] == temp) {
					base64 = binary_tables.base64_binary[j][0] + base64;
					break;
				}
			}
		}
		if(number.length!==0) {
			number = "0" + number;
			while(number.length<6) {
				number = "0" + number;
			}
			for(var k=0; k<64; ++k) {
				if(binary_tables.base64_binary[k][1] == number) {
					base64 = binary_tables.base64_binary[k][0] + base64;
					break;
				}
			}
		}
		base64 = base64.replace(/^[A\s]+/, '');
		if(base64==="") {
			return "A";
		}
		return base64;
	};
}

	/********************************************************************\
				┌─┐┌─┐┌┬┐┌─┐┬     ┌─┐┌─┐┌┐┬┬  ┬┌─┐┬─┐┌┬┐┌─┐┬─┐
				│ ││   │ ├─┤│     │  │ ││││└┐┌┘├─ ├┬┘ │ ├─ ├┬┘
				└─┘└─┘ ┴ ┴ ┴┴─┘   └─┘└─┘┴└┘ └┘ └─┘┴└─ ┴ └─┘┴└─
	\********************************************************************/

function OctalConverter() {

	// octal to binary
	this.binary = function(number) {
		"use strict";
		number = number.replace(/\s/g, '');
		if(number==="") {
			return "";
		}
		var binary="";
		for(var i=0; i<number.length; ++i) {
			for(var j=0; j<8; ++j) {
				if(binary_tables.octal_binary[j][0] == number[i]) {
					binary += binary_tables.octal_binary[j][1] + " ";
					break;
				}
			}
		}
		binary = binary.replace(/^[0\s]+/, '');
		if(binary==="") {
			return "0";
		}
		return binary;
	};

	// octal to octal
	this.octal = function(number) {
		"use strict";
		if(number==="") {
			return "";
		}
		number = number.replace(/^[0\s]+/, '');
		if(number==="") {
			return "0";
		}
		return number;
	};

	// octal to decimal
	this.decimal = function(number) {
		"use strict";
		return NumberConverter.binary.decimal(NumberConverter.octal.binary(number));
	};

	// octal to hex
	this.hex = function(number) {
		"use strict";
		return NumberConverter.binary.hex(NumberConverter.octal.binary(number));
	};

	// octal to base 32
	this.base32 = function(number) {
		"use strict";
		return NumberConverter.binary.base32(NumberConverter.octal.binary(number));
	};

	// octal to base 64
	this.base64 = function(number) {
		"use strict";
		return NumberConverter.binary.base64(NumberConverter.octal.binary(number));
	};
}

	/********************************************************************\
			┬─┐┌─┐┌─┐ ┬ ┌┬┐┌─┐┬     ┌─┐┌─┐┌┐┬┬  ┬┌─┐┬─┐┌┬┐┌─┐┬─┐
			│ │├─ │   │ │││├─┤│     │  │ ││││└┐┌┘├─ ├┬┘ │ ├─ ├┬┘
			┴─┘└─┘└─┘ ┴ ┴ ┴┴ ┴┴─┘   └─┘└─┘┴└┘ └┘ └─┘┴└─ ┴ └─┘┴└─
	\********************************************************************/

function DecimalConverter() {

	// decimal to binary
	this.binary = function(number) {
		"use strict";
		number = number.replace(/\s/g, '');
		if(number === "") {
			return "";
		}
		var stage = "1";
		while(NString.subtract(number, stage) != "out_of_scope") {
			stage = NString.multiplybytwo(stage);
		}
		var binary="";
		while(stage!="1") {
			stage = NString.dividebytwo(stage);
			if(NString.subtract(number, stage) != "out_of_scope") {
				binary += "1";
				number = NString.subtract(number, stage);
			}
			else {
				binary += "0";
			}
		}
		binary = binary.replace(/^[0\s]+/, '');
		if(binary==="") {
			return "0";
		}
		return binary;
	};

	// decimal to octal
	this.octal = function(number) {
		"use strict";
		return NumberConverter.binary.octal(NumberConverter.decimal.binary(number));
	};

	// decimal to decimal
	this.decimal = function(number) {
		"use strict";
		if(number==="") {
			return "";
		}
		number = number.replace(/^[0\s]+/, '');
		if(number==="") {
			return "0";
		}
		return number;
	};

	// decimal to hex
	this.hex = function(number) {
		"use strict";
		return NumberConverter.binary.hex(NumberConverter.decimal.binary(number));
	};

	// decimal to base 32
	this.base32 = function(number) {
		"use strict";
		return NumberConverter.binary.base32(NumberConverter.decimal.binary(number));
	};

	this.base64 = function(number) {
		"use strict";
		return NumberConverter.binary.base64(NumberConverter.decimal.binary(number));
	};
}

	/********************************************************************\
				┬ ┬┌─┐─┐ ┬   ┌─┐┌─┐┌┐┬┬  ┬┌─┐┬─┐┌┬┐┌─┐┬─┐
				├─┤├─ ┌┴┬┘   │  │ ││││└┐┌┘├─ ├┬┘ │ ├─ ├┬┘
				┴ ┴└─┘┴ └─   └─┘└─┘┴└┘ └┘ └─┘┴└─ ┴ └─┘┴└─
	\********************************************************************/

function HexConverter() {

	// hex to binary
	this.binary = function(number) {
		"use strict";
		number = number.replace(/\s/g, '');
		if(number==="") {
			return "";
		}
		var binary="";
		for(var i=0; i<number.length; ++i) {
			for(var j=0; j<16; ++j) {
				if(binary_tables.hex_binary[j][0] == number[i]) {
					binary += binary_tables.hex_binary[j][1] + " ";
					break;
				}
			}
		}
		binary = binary.replace(/^[0\s]+/, '');
		if(binary==="") {
			return "0";
		}
		return binary;
	};

	// hex to octal
	this.octal = function(number) {
		"use strict";
		return NumberConverter.binary.octal(NumberConverter.hex.binary(number));
	};

	// hex to decimal
	this.decimal = function(number) {
		"use strict";
		return NumberConverter.binary.decimal(NumberConverter.hex.binary(number));
	};

	// hex to hex
	this.hex = function(number) {
		"use strict";
		if(number==="") {
			return "";
		}
		number = number.replace(/^[0\s]+/, '');
		if(number==="") {
			return "0";
		}
		return number;
	};

	// hex to base 32
	this.base32 = function(number) {
		"use strict";
		return NumberConverter.binary.base32(NumberConverter.hex.binary(number));
	};

	// hex to base 64
	this.base64 = function(number) {
		"use strict";
		return NumberConverter.binary.base64(NumberConverter.hex.binary(number));
	};
}

	/********************************************************************\
			┬┐ ┌─┐┌─┐┌─┐   ──┐ ─┐   ┌─┐┌─┐┌┐┬┬  ┬┌─┐┬─┐┌┬┐┌─┐┬─┐
			├┴┐├─┤└─┐├─     ─┤┌─┘   │  │ ││││└┐┌┘├─ ├┬┘ │ ├─ ├┬┘
			┴─┘┴ ┴└─┘└─┘   ──┘└──   └─┘└─┘┴└┘ └┘ └─┘┴└─ ┴ └─┘┴└─
	\********************************************************************/

function Base32Converter() {

	// base 32 to binary
	this.binary = function(number) {
		"use strict";
		number = number.replace(/\s/g, '');
		if(number==="") {
			return "";
		}
		var binary="";
		for(var i=0; i<number.length; ++i) {
			for(var j=0; j<32; ++j) {
				if(binary_tables.base32_binary[j][0] == number[i]) {
					binary += binary_tables.base32_binary[j][1] + " ";
					break;
				}
			}
		}
		binary = binary.replace(/^[0\s]+/, '');
		if(binary==="") {
			return "0";
		}
		return binary;
	};

	// base 32 to octal
	this.octal = function(number) {
		"use strict";
		return NumberConverter.binary.octal(NumberConverter.base32.binary(number));
	};

	// base 32 to decimal
	this.decimal = function(number) {
		"use strict";
		return NumberConverter.binary.decimal(NumberConverter.base32.binary(number));
	};

	// base 32 to hex
	this.hex = function(number) {
		"use strict";
		return NumberConverter.binary.hex(NumberConverter.base32.binary(number));
	};

	// base 32 to base 32
	this.base32 = function(number) {
		"use strict";
		if(number==="") {
			return "";
		}
		number = number.replace(/^[a\s]+/, '');
		if(number==="") {
			return "a";
		}
		return number;
	};

	// base 32 to base 64
	this.base64 = function(number) {
		"use strict";
		return NumberConverter.binary.base64(NumberConverter.base32.binary(number));
	};
}

	/********************************************************************\
			┬┐ ┌─┐┌─┐┌─┐   ┌─ ┬ ┬   ┌─┐┌─┐┌┐┬┬  ┬┌─┐┬─┐┌┬┐┌─┐┬─┐
			├┴┐├─┤└─┐├─    ├─┐└─┤   │  │ ││││└┐┌┘├─ ├┬┘ │ ├─ ├┬┘
			┴─┘┴ ┴└─┘└─┘   └─┘  ┴   └─┘└─┘┴└┘ └┘ └─┘┴└─ ┴ └─┘┴└─
	\********************************************************************/

function Base64Converter() {

	// base 64 to binary
	this.binary = function(number) {
		"use strict";
		number = number.replace(/\s/g, '');
		if(number==="") {
			return "";
		}
		var binary="";
		for(var i=0; i<number.length; ++i) {
			for(var j=0; j<64; ++j) {
				if(binary_tables.base64_binary[j][0] == number[i]) {
					binary += binary_tables.base64_binary[j][1] + " ";
					break;
				}
			}
		}
		binary = binary.replace(/^[0\s]+/, '');
		if(binary==="") {
			return "0";
		}
		return binary;
	};

	// base 64 to octal
	this.octal = function(number) {
		"use strict";
		return NumberConverter.binary.octal(NumberConverter.base64.binary(number));
	};

	// base 64 to decimal
	this.decimal = function(number) {
		"use strict";
		return NumberConverter.binary.decimal(NumberConverter.base64.binary(number));
	};

	// base 64 to hex
	this.hex = function(number) {
		"use strict";
		return NumberConverter.binary.hex(NumberConverter.base64.binary(number));
	};

	// base 64 to base 32
	this.base32 = function(number) {
		"use strict";
		return NumberConverter.binary.base32(NumberConverter.base64.binary(number));
	};

	// base64 to base64
	this.base64 = function(number) {
		"use strict";
		if(number==="") {
			return "";
		}
		number = number.replace(/^[A\s]+/, '');
		if(number==="") {
			return "A";
		}
		return number;
	};
}



	/********************************************************************\
							┌┐┬┌─┐┌┬┐┬─┐ ┬ ┌┐┬┌─┐
							│││└─┐ │ ├┬┘ │ ││││ ┐
							┴└┘└─┘ ┴ ┴└─ ┴ ┴└┘└─┘
	\********************************************************************/

	/*
	NString class was created in effort to erase precision limits of javascript's integer type (overflow problem). It is not capable of serious
	string based calculations though. It only works for non negative integers. I can see it being expanded in future but for now those functions
	with their limitations are enough to run converters (converters only work for non negative integers as well) 
	*/

var NString = {

	multiplybytwo: function(number) {
		"use strict";
		return this.add(number, number);
	},

	// divade by 2 (used for binary bases, only works for even integers)
	dividebytwo: function(number) {
		"use strict";
		number = number.replace(/^0+/, '');
		var pass=0;
		var res = "";
		for(var i=0; i<number.length; ++i) {
			var number_digit = parseInt(number[i]);
			res +=  (Math.floor(((number_digit + 10 * pass)/2))).toString();
			pass = number_digit % 2;
		}
		res = res.replace(/^0+/, '');
		return res;
	},

	// subract (lhs > rhs)
	subtract: function(lhs, rhs) {
		"use strict";
		lhs = lhs.replace(/^0+/, '');
		rhs = rhs.replace(/^0+/, '');
		if(lhs.length < rhs.length) {
			return "out_of_scope";
		}
		var res="";
		var pass = 0;
		for(var i=0; i < lhs.length; ++i) {
			var lhs_digit = 0;
			var rhs_digit = 0;
			lhs_digit = parseInt(lhs[lhs.length - i-1]);
			if(rhs.length - i >0) {
				rhs_digit = parseInt(rhs[rhs.length - i-1]);
			}
			if(lhs_digit - rhs_digit - pass >= 0) {
				res = (lhs_digit - rhs_digit - pass).toString() + res;
				pass = 0;
			}
			else {
				res = (lhs_digit - rhs_digit - pass + 10).toString() + res;
				pass=1;
			}
		}
		if(pass==1) {
			return "out_of_scope";
		}
		res = res.replace(/^0+/, '');
		return res;
	},

	// add
	add: function(lhs, rhs) {
		"use strict";
		lhs = lhs.replace(/^0+/, '');
		rhs = rhs.replace(/^0+/, '');
		var res="";
		var pass = 0;
		for(var i=0; i < Math.max(lhs.length, rhs.length); ++i) {
			var lhs_digit = 0;
			var rhs_digit = 0;
			if(lhs.length - i >0) {
				lhs_digit = parseInt(lhs[lhs.length - i-1]);
			}
			if(rhs.length - i >0) {
				rhs_digit = parseInt(rhs[rhs.length - i-1]);
			}
			if(pass + lhs_digit + rhs_digit < 10) {
				res = (pass + lhs_digit + rhs_digit).toString() + res;
				pass = 0;
			}
			else {
				res = (pass + lhs_digit + rhs_digit - 10).toString() + res;
				pass=1;
			}
		}
		if(pass==1) {
			res = "1" + res;
		}
		return res;
	}
};

	/********************************************************************\
				┬┐  ┬ ┌┐┬┌─┐┬─┐┬ ┬   ┌┬┐┌─┐┬┐ ┬  ┌─┐┌─┐
				├┴┐ │ │││├─┤├┬┘└┬┘    │ ├─┤├┴┐│  ├─ └─┐
				┴─┘ ┴ ┴└┘┴ ┴┴└─ ┴     ┴ ┴ ┴┴─┘┴─┘└─┘└─┘
	\********************************************************************/
	
var binary_tables = {
	octal_binary: [
		["0", "000"],
		["1", "001"],
		["2", "010"],
		["3", "011"],
		["4", "100"],
		["5", "101"],
		["6", "110"],
		["7", "111"]
	],

	hex_binary: [
		["0", "0000"],
		["1", "0001"],
		["2", "0010"],
		["3", "0011"],
		["4", "0100"],
		["5", "0101"],
		["6", "0110"],
		["7", "0111"],
		["8", "1000"],
		["9", "1001"],
		["a", "1010"],
		["b", "1011"],
		["c", "1100"],
		["d", "1101"],
		["e", "1110"],
		["f", "1111"]
	],

	base32_binary: [
		["a", "00000"],
		["b", "00001"],
		["c", "00010"],
		["d", "00011"],
		["e", "00100"],
		["f", "00101"],
		["g", "00110"],
		["h", "00111"],
		["i", "01000"],
		["j", "01001"],
		["k", "01010"],
		["l", "01011"],
		["m", "01100"],
		["n", "01101"],
		["o", "01110"],
		["p", "01111"],
		["q", "10000"],
		["r", "10001"],
		["s", "10010"],
		["t", "10011"],
		["u", "10100"],
		["v", "10101"],
		["w", "10110"],
		["x", "10111"],
		["y", "11000"],
		["z", "11001"],
		["2", "11010"],
		["3", "11011"],
		["4", "11100"],
		["5", "11101"],
		["6", "11110"],
		["7", "11111"]
	],

	base64_binary: [
		["A", "000000"],
		["B", "000001"],
		["C", "000010"],
		["D", "000011"],
		["E", "000100"],
		["F", "000101"],
		["G", "000110"],
		["H", "000111"],
		["I", "001000"],
		["J", "001001"],
		["K", "001010"],
		["L", "001011"],
		["M", "001100"],
		["N", "001101"],
		["O", "001110"],
		["P", "001111"],
		["Q", "010000"],
		["R", "010001"],
		["S", "010010"],
		["T", "010011"],
		["U", "010100"],
		["V", "010101"],
		["W", "010110"],
		["X", "010111"],
		["Y", "011000"],
		["Z", "011001"],
		["a", "011010"],
		["b", "011011"],
		["c", "011100"],
		["d", "011101"],
		["e", "011110"],
		["f", "011111"],
		["g", "100000"],
		["h", "100001"],
		["i", "100010"],
		["j", "100011"],
		["k", "100100"],
		["l", "100101"],
		["m", "100110"],
		["n", "100111"],
		["o", "101000"],
		["p", "101001"],
		["q", "101010"],
		["r", "101011"],
		["s", "101100"],
		["t", "101101"],
		["u", "101110"],
		["v", "101111"],
		["w", "110000"],
		["x", "110001"],
		["y", "110010"],
		["z", "110011"],
		["0", "110100"],
		["1", "110101"],
		["2", "110110"],
		["3", "110111"],
		["4", "111000"],
		["5", "111001"],
		["6", "111010"],
		["7", "111011"],
		["8", "111100"],
		["9", "111101"],
		["+", "111110"],
		["/", "111111"]
	]
};
