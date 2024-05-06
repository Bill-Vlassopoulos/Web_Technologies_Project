let divs = document.querySelectorAll('div.boxes');
let length = divs.length;

checkboxes = document.querySelectorAll('.boxes input[type=checkbox]');

for (let i = 0; i < checkboxes.length; i++) {

    if (checkboxes[i].checked) {
        checkboxes[i].checked = false;
    }

}

for (let i = 0; i < length; i++) {
    let checkbox = divs[i].querySelector('input[type=checkbox]');
    checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
            divs[i].style.backgroundColor = 'green'; // replace 'green' with your desired color
        } else {
            divs[i].style.backgroundColor = 'red'; // replace 'red' with your desired color
        }
    });
}