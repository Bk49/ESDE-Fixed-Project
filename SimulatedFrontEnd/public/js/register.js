let $registerFormContainer = $('#registerFormContainer');
if ($registerFormContainer.length != 0) {
    console.log('Registration form detected. Binding event handling logic to form elements.');
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to submit registration details
    //to server-side api when the #submitButton element fires the click event.
    $('#submitButton').on('click', function(event) {
        event.preventDefault();
        const baseUrl = 'http://localhost:5000';
        let fullName = $('#fullNameInput').val();
        let email = $('#emailInput').val();
        let password = $('#passwordInput').val();
        let webFormData = new FormData();
        webFormData.append('fullName', fullName);
        webFormData.append('email', email);
        webFormData.append('password', password);
        axios({
                method: 'post',
                url: baseUrl + '/api/user/register',
                data: webFormData,
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(function(response) {
                //Handle success
                console.dir(response);
                new Noty({
                    type: 'success',
                    timeout: '6000',
                    layout: 'topCenter',
                    theme: 'bootstrap-v4',
                    text: 'You have registered. Please <a href="login.html" class=" class="btn btn-default btn-sm" >Login</a>',
                }).show();
            })
            .catch(function(response) {
                //Handle error
                console.dir(response);
                new Noty({
                    timeout: '6000',
                    type: 'error',
                    layout: 'topCenter',
                    theme: 'sunset',
                    text: 'Unable to register.',
                }).show();

            
                   var errText = "";
                    errors = [];
                    if (password.length < 8 || password.length > 18) {
                        errors.push("Your password must be at least 8 characters and less than 18 characters"); 
                    }
                    if (password.search(/(?=.*?[A-Z])/) < 0) {
                        errors.push("Your password must contain at least one upper case letter.");
                    }
                    if (password.search(/(?=.*?[a-z])/) < 0) {
                        errors.push("Your password must contain at least one lower case letter."); 
                    }
                    if (password.search(/(?=.*?[0-9])/) < 0) {
                        errors.push("Your password must contain at least one digit."); 
                    }
                    if (password.search(/(?=.*?[#?!@$%^&*-])/) < 0) {
                        errors.push("Your password must contain at least one special character."); 
                    }

                        for(var i = 0; i < errors.length; i++)
                        errText += errors[i] + "<br>"
                        document.getElementById("pwError").innerHTML = errText;

                
                
            });
    });

} //End of checking for $registerFormContainer jQuery object