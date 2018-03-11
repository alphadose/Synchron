function movePerson(direction) {
    if (direction.match(/ight/gi) || direction.match(/back/gi) || direction.match(/forward/gi) || direction.match(/left/gi) || direction.match(/stop/gi)) {
        let mainCamera = document.createElement("a-animation");
        let parent = document.getElementById("main-camera")
        mainCamera.setAttribute("attribute", "position")
        mainCamera.setAttribute("easing", "linear")
        mainCamera.setAttribute("dur", "5000")
        let parentPos = parent.getAttribute("position")
        let pos = parentPos.x + " " + parentPos.y + " " + parentPos.z
        mainCamera.setAttribute("from", pos)
        pos = pos.split(" ").map(function (val) {
            return parseFloat(val)
        })
        if (parent.querySelector("a-animation")) {
            // pos = parent.querySelector("a-animation").data.to
            // mainCamera.setAttribute("from", pos)
            parent.removeChild(parent.childNodes[0]);
        }
        let allowed = 0;
        if (pos) {
            if (direction.match(/ight/gi)) {
                pos[0] += 2
                allowed = 1
            }
            else if (direction.match(/left/gi)) {
                pos[0] -= 2
                allowed = 1
            }
            else if (direction.match(/forward/gi)) {
                pos[2] -= 2
                allowed = 1
            }
            else if (direction.match(/back/gi)) {
                pos[2] += 2
                allowed = 1
            }
        }
        toast("Applied: " + direction, 2000, "fixed-score");
        console.log(pos)
        if (!direction.match(/stop/gi) && pos) {
            mainCamera.setAttribute("to", pos[0] + " 1.5 " + pos[2]);
            parent.insertBefore(mainCamera, parent.childNodes[0])
            parent.setAttribute("position", {x:pos[0],y:pos[1],z:pos[2]})
        }
    }
}
