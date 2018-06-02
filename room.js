function Room(id) {
	this.id = id;
	this.members = 1;
	this.admin = id;
	console.log("Admin added");
}

module.exports = Room;