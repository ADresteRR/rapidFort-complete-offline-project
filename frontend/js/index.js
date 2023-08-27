// file from the input field
var fileInput = document.getElementById("file-input");

// container where result would append
var containerDiv = document.getElementsByClassName("container")[0];

const API_URL = "https://rapidfort-back-end-production.up.railway.app/upload"

// create table form the json file return from api
function createTable(jsonObject) {
    // Create a table element
    var table = document.createElement("table");
    table.style.border = "1px solid black";
    table.style.borderCollapse = "collapse";
    table.style.width = "80%";
    table.style.height = "50vh";
    table.style.overflow = "auto";

    // Loop through the keys and values of the JSON object
    for (var key in jsonObject) {
        // Check if the value is not null or undefined
        if (jsonObject[key] != null && jsonObject[key] != undefined) {
            // Create a table row for each key-value pair
            var row = document.createElement("tr");

            // Create a table header cell for the key
            var headerCell = document.createElement("th");
            headerCell.style.border = "1px solid black";
            headerCell.style.padding = "10px";

            headerCell.textContent = key;
            row.appendChild(headerCell);

            // new data cell
            var valueCell = document.createElement("td");
            valueCell.style.border = "1px solid black";
            valueCell.style.padding = "10px";

            // if value is another object
            if (typeof jsonObject[key] === "object") {
                var nestedTable = createTable(jsonObject[key]);
                valueCell.appendChild(nestedTable);
            } else {
                // Check if the value is longer than 250 characters
                if (jsonObject[key].length > 250) {
                    // Truncate the value and add an ellipsis at the end
                    var truncatedValue = jsonObject[key].substring(0, 250) + "...";
                } else {
                    // Use the value as it is
                    var truncatedValue = jsonObject[key];
                }

                valueCell.textContent = truncatedValue;
            }

            // Append the value cell to the row
            row.appendChild(valueCell);

            // Append the row to the table
            table.appendChild(row);
        }
    }

    // Return the table element
    return table;
}

// Make an API call when new file is added
fileInput.addEventListener("change", function () {
    // Get the selected file
    var file = fileInput.files[0];

    // prepare the format in which api call accept the file
    var formData = new FormData();

    formData.append("file", file);

    //making api call
    fetch(API_URL, {
        method: "POST",
        body: formData
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.statusText);
            }
        })
        .then(function (data) {
            // Check if there is an existing table in the container div
            var existingTable = containerDiv.getElementsByTagName("table")[0];

            // If there is an existing table, remove it from the container div
            if (existingTable) {
                containerDiv.removeChild(existingTable);
            }
            var table = createTable(data);
            containerDiv.appendChild(table);
        })
        .catch(function (error) {
            alert("An error occurred: " + error.message);
        });
});
