/*
Authors:
Adam Stück, Bianca Kevy, Cecilie Hejlesen
Frederik Stær, Lasse Rasmussen and Tais Hors

Group: DAT2 - C1-14
Date: 27/05-2020

This file contains the different sorting functions used to 
sort through the case list on the dispatcher side and to
sort through all posts on the editor side's dashboard
*/

function sortTable (tableID, colIndex, sortByID) {
    let sorting = true;
    let rows, i, caseId1, caseId2, x, y, shouldSwap, direction;
    let switchcount = 0;
    let table = document.getElementById(tableID);
    direction = 'asc';

    while (sorting) {
        sorting = false;
        rows = table.rows;

        if (sortByID) {
            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwap = false;
                caseId1 = rows[i].getElementsByTagName("TD")[colIndex];
                caseId2 = rows[i + 1].getElementsByTagName("TD")[colIndex];
                if (direction == 'asc') {
                    if (Number(caseId1.innerText) > Number(caseId2.innerText)) {
                        shouldSwap = true;
                        break;
                    }
                } else if (direction == 'desc') {
                    if (Number(caseId1.innerText) < Number(caseId2.innerText)) {
                        shouldSwap = true;
                        break;
                    }
                }
            }
        } else {
            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwap = false;
                x = rows[i].getElementsByTagName("TD")[colIndex];
                y = rows[i + 1].getElementsByTagName("TD")[colIndex];
                if (direction == "asc") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        shouldSwap = true;
                        break;
                    }
                } else if (direction == "desc") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        shouldSwap = true;
                        break;
                    }
                }
            }
        }

        if (shouldSwap) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            sorting = true;
            switchcount++;
        } else {
            if (switchcount == 0 && direction == 'asc') {
                direction = 'desc';
                sorting = true;
            }
        }
    }
}
