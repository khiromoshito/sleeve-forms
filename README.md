# sleeve-forms
A JS library for manageable form handling-- the best remedy against manual form validations


## Usage

This should be added at the head section of the webpage for initializing classes.

```html 
<head>
  ...
  <script src="./your-custom-scripts-path/sleeve-forms.js"></script>
  ...
</head>
```

Below is an example of implementing the library...

```js
// JavaScript

// This creates a new instance of the Form class
var form = new Form();



// In setting up the input fields, you can either...

// (1) Set the form element (or any child-bearing element that contains the input fields).
// This automatically sets the input fields by looking up through its children for any
// elements with the [name] attribute
form.setElement(document.getElementById("myform"));


// (2) You can manually set the input fields yourself, together with their fieldNames (the supposed [name] attribute)
form.setFields({
  email: document.getElementById("email-field"),
  password: document.getElementById("password-field"),
});


// An onChange listener can then be set. This listener is fired when one of the 
// registered input fields changes value

// The onChange method has two parameters:
// (0) isValid - a boolean that asserts if all input field values are valid (follows rules)
// (1) fields - an object with a key-value pair (fieldName-FormField object) that represents
//   the FormField object corresponsding to the given fieldName
form.onChange = (isValid, fields) {
  // Below logs the value of the 'email' field
  console.log(fields["email"].value);
  
  // The values of the [fields] object are FormField instances, which holds
  // properties like:
  //  >> element (the containing HTML element), 
  //  >> value (the string value of the input field),
  //  >> rules (the string (for regexp) for field validation), and
  //  >> isValid (boolean assert for if the current value abides the rules)
};


// You can also manually set rules for every fields (for the ones that are not specified, 
// these all will default to FieldRules.notEmptyNorSpace).

// These rules are basically string that contains regular expressions
// which are then converted to RegExp in the validation process.

// sleeve-forms provides preset references for rules, all under the [FieldRules] object.

form.setRules({
  // from the presets
  email: FieldRules.emailAddress,
  
  // custom regexp string
  password: ".{8,}"
});
```

## Contributions
This project is open-source, so contributions are widely welcome.

The library's current demand are more field rules to be stored under the FieldRules object.



## About Sleeve

Sleeve is a growing web framework, currently under construction.
Sleeve bits is then a library collection for helping web developers export quality product over quantity work.

