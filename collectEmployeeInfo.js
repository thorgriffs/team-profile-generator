const inquirer = require('inquirer');
const validator = require('email-validator');

module.exports = function(cb) {
	askForManagerInfo(cb);
}

var validateNotBlank = function (value) {
  var pass = !!value.trim();
  if (pass) {
	return true;
  }

  return 'Please enter something!';
}

var commonQuestions = [
  {
    type: 'input',
    name: 'name',
    message: "What is the employee's name?",
    validate: validateNotBlank,
	when: function (answers) {
      return !answers.done;
    }
  },
  {
    type: 'input',
    name: 'id',
    message: "What is the employee's id?",
    validate: validateNotBlank,
	when: function (answers) {
      return !answers.done;
    }
  },
  {
    type: 'input',
    name: 'email',
    message: "What is the employee's email address?",
    validate: function(email) {
		var pass = validator.validate(email);
		if(pass) {
            return true;
        }
        return 'Please enter a valid email address';
	},
	when: function (answers) {
      return !answers.done;
    }
  }
];

var officeNumberQuestion = {
	type: 'input',
	name: 'officeNumber',
	message: "What is the employee's office number?",
	validate: validateNotBlank,
};
var doneQuestion = {
    type: 'confirm',
    name: 'done',
    message: 'Are you done?',
    default: false,
};

var managerQuestions = commonQuestions.concat([officeNumberQuestion, doneQuestion]);

var roleQuestion = {
	type: 'list',
	name: 'role',
	message: 'What role would you like to add?',
	choices: ['Intern', 'Engineer']
};
var githubQuestion = {
    type: 'input',
    name: 'github',
    message: "What is the employee's github username?",
    validate: validateNotBlank,
	when: function (answers) {
      return !answers.done && answers.role === 'Engineer';
    }
  };
var schoolQuestion = {
    type: 'input',
    name: 'school',
    message: "What is the employee's school?",
    validate: validateNotBlank,
	when: function (answers) {
      return !answers.done && answers.role === 'Intern';
    }
  };

var nonManagerQuestions = [roleQuestion, ...commonQuestions, githubQuestion, schoolQuestion, doneQuestion];

function askForManagerInfo(onDone) {
	
	console.log("Hello. Please answer the following questions to build the team profile.  Let's start the Manager's information.\n");
	var employees = [];

	inquirer.prompt(managerQuestions).then((answers) => {
		
		//not asking for the initial role selection, needs to be added
		answers.role = 'Manager';
		
		employees.push(answers);
		
		if (!answers.done) {
			askForNonManagers(employees, onDone);
		}
		else {
			onDone(employees);
		}
		
	});
}

function askForNonManagers(employees, onDone) {
	
	inquirer.prompt(nonManagerQuestions).then(answers => {
		
		employees.push(answers);
		
		if (!answers.done) {
			askForNonManagers(employees, onDone);
		}
		else {
			onDone(employees);
		}
	});
}