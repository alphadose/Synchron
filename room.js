function Room(socketId, peerId, username) {
	this.name = socketId;
	this.strength = 1;
	this.admin = peerId;
	this.members = {};
	this.members[peerId] = username;
	this.load = 0;
	this.adminHandle = username;
}

Room.prototype.addMember = function(id, username) {
	this.strength++;
	this.members[id] = username;
}

module.exports = Room;