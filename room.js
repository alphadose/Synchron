function Room(socketId, peerId) {
	this.name = socketId;
	this.strength = 1;
	this.admin = peerId;
	this.members = [];
	this.members.push(peerId);
	this.load = 0;
}

Room.prototype.addMember = function(id) {
	this.members.push(id);
	this.strength++;
}

module.exports = Room;