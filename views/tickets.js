function editTickets() {
    let quantity = document.getElementById('quantity').value;
    for (let i = 2; i <= quantity; i++) {
        let ticket = document.querySelector(`.ksechoristo-ticket`);
        let clone = ticket.cloneNode(true);
        //add event listener to the clone when i hit the checkbox the background color to become orange
        clone.querySelector('h2').textContent = `Εισιτήριο #${i}`;
        ticket.parentNode.appendChild(clone);
    }

    let tickets = document.querySelectorAll('.ksechoristo-ticket');
    tickets.forEach(ticket => {
        ticket.style.display = 'flex';
        let ektheseisDivs = ticket.querySelectorAll('.ektheseis');
        ektheseisDivs.forEach(ektheseisDiv => {
            ektheseisDiv.addEventListener('click', function (event) {
                // Change background color to orange
                event.target.classList.toggle('selected');
            });
        });
    });




}