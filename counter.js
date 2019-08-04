/**
Copyright (C) 2019  Florian Schleich <florian@dailycoding.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

module.exports = function(RED) {
    function NamedCounterNode(config) {
        let tokens = JSON.parse(config.tokens);
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            if(msg.hasOwnProperty('reset')) {
                if(msg.payload == '') {
                    let allNames = Object.keys(tokens);
                    allNames.forEach(function(key) {
                        tokens[key].counter = 0;
                    });
                } else {
                    if(tokens.hasOwnProperty(msg.payload)) {tokens[msg.payload].counter=0;}
                }
            } else {
		    msg.counter = tokens[msg.payload];
		    if (tokens.hasOwnProperty(msg.payload)) {
		        tokens[msg.payload].counter = (tokens[msg.payload].counter || 0) + 1;
		        msg.counter.isMax = false;
		        if (tokens[msg.payload].counter > tokens[msg.payload].maxValue) {
		            tokens[msg.payload].counter = tokens[msg.payload].counter - 1;
			    msg.counter.isMax = true;
		        }
		    } else {
		        node.send([,,msg]);
		    }

		    if(msg.counter.isMax) {
		        node.send([,msg,]);
		    } else {
		        node.send([msg,,]);
		    }
            }
        });
    }
    RED.nodes.registerType("named-counter",NamedCounterNode);
}
