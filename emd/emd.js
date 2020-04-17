let map = new google.maps.Map(document.getElementById("map"), {
    zoom: 6.6,
    center: new google.maps.LatLng(56.263920, 9.501785),
    mapTypeId: google.maps.MapTypeId.ROADMAP
});

const caseList = document.getElementById('cases');
const journalID = document.getElementById('journal-id');
const journalName = document.getElementById('journal-name');
const journalPhone = document.getElementById('journal-phone');
const journalCPR = document.getElementById('journal-cpr');
const journalLocation = document.getElementById('journal-location');
const journalTime = document.getElementById('journal-fulltime');
const journalDescription = document.getElementById('journal-description');

let ws = new WebSocket("ws://localhost:3001");

ws.onopen = function() {
    console.log("Connected to the server.");

    SendToServer({
        type: "EMDConnect"
    });
}

ws.onmessage = function(event) {
    data = JSON.parse(event.data);

    switch(data.type) {
        case "Case":
            console.log(`New case received. ID: ${parseInt(data.id)}`);
            AddCase(data);
            break;
        case "CloseCase":
            for (var i = 0; i < table.rows.length; i++) {
                if(table.rows[i].id == json.id) {
                    // Remove the marker from the map and delete the row from the table.
                    table.rows[i].marker.setMap(null);
                    table.deleteRow(i);
                    break;
                }
            }
            break;
        default:
            console.log("Received some weird data... ");
            break;
    }
}

function AddCase(data) {
    let row = caseList.insertRow();

    //ID Button
    let idBtnCell = row.insertCell();
    let idBtn = document.createElement("BUTTON");
    idBtn.innerHTML = data.id;
    idBtnCell.appendChild(idBtn);
    row.insertCell().innerHTML = "Open";
    row.insertCell().innerHTML = data.timeClock;
    row.marker = PlaceMarker(data.id, data.pos);
    row.id = data.id;

    //displaying the journal entry for the corresponding case ID
    idBtn.addEventListener('click', () => {
      map.setCenter(data.pos)
      journalID.innerHTML = "Case ID: " + data.id;
      journalName.innerHTML = "Name: " + data.name;
      journalPhone.innerHTML = "Phone: " + data.phone;
      journalCPR.innerHTML = "CPR: " + data.cpr;
      journalLocation.innerHTML = "Location: " + data.location;
      journalTime.innerHTML = "Time created: " + data.timeDate + " " + data.timeClock;
      journalDescription.innerHTML = "Description: " + data.desc;

        // changing the Case ID in chat to corresponding case
        document.getElementById('chatId').textContent = "Case ID: " + data.id;
    })
  }

function PlaceMarker(id, location) {
    return new google.maps.Marker({
        position: location,
        map: map,
        label: id.toString(),
        draggable: false,
    });
}

function CloseCase(id) {
    let check = prompt("Write 'DELETE' to close the case.");

    if(check == "DELETE") {
        SendToServer({
            type: "CloseCase",
            id: id
        });
        alert(`Case deleted. (id: ${id})`);
    }
}

function SendToServer(data) {
    ws.send(JSON.stringify(data));
}
