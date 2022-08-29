(function () { 
    'use strict'
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.validated-form')
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {  // probably uses a function since it needs to run a callback
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault() // stops default action of the event (form submission)
                    event.stopPropagation() // stops event from bubbling up in case of nested html tags?
                }
                form.classList.add('was-validated')
            }, false)
        })
})()
