import { Accounts } 					from 'meteor/accounts-base';
// import { Accounts } 					from 'meteor/std:accounts-ui'

Accounts.config({
	sendVerificationEmail: false,
	forbidClientAccountCreation: false
});

Accounts.ui.config({
	passwordSignupFields: 'USERNAME_AND_EMAIL',
});