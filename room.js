function Room(socketId, peerId, username) {
	this.name = socketId;
	this.strength = 1;
	this.admin = peerId;
	this.members = {};
	this.members[socketId] = username;
	this.load = 0;
	this.adminHandle = username;
	this.roomHandle = username.toUpperCase() + "'s ROOM";
	this.positions = [[-2,0,1],
					  [0,0,1],
					  [2,0,1]];
	this.index = 2;
}

Room.prototype.addMember = function(id, username) {
	this.strength++;
	this.members[id] = username;
}

Room.prototype.removeMember = function(socketId) {
	this.strength--;
	if (this.load > 0) {
		this.load--;
	}
	delete this.members[socketId];
}

module.exports = Room;