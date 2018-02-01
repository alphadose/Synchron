function Room(id) {
	this.id = id;
	this.strength = 1;
	this.admin = id;
	this.members = [];
	this.members.push(id);
}

Room.prototype.addMember = function(id) {
	this.members.push(id);
	this.strength++;
}

module.exports = Room;