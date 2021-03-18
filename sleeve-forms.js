



/**
 * 
 * 
 * Sleeve FORMS
 * 
 * Sleeve Forms is a JS library for 
 * manageable form handling. The best
 * remedy against manual form validations. 
 * 
 * 
 * 
 */


/** Internal tool not meant for outside development */
var FormUtils = {

    registerChangeListeners: function(fieldElement, listener) {
        let inputChangeEvents = ["input"];
        let selectorChangeEvents = ["change"];

        if(fieldElement.tagName=="INPUT") 
            inputChangeEvents.forEach(eventName=>
                fieldElement.addEventListener(eventName, ()=>{
                    console.log("<TRIGGERED '"+eventName+"'>");
                    listener(FormUtils.getValue(fieldElement));
                }));
    },

    /** This gets the corresponding value for a field element. Instead of the
     * specific .value property, this method is used for elements that may not
     * contain values from the value property/attribute
     */
    getValue: function(fieldElement) {
        if(fieldElement.tagName=="INPUT") return fieldElement.value;
        
        return fieldElement.value || fieldElement.textContent;
    }
}

function FormField(element, rules) {
    this.element = element;
    this.value = FormUtils.getValue(element);
    this.rules = rules;
    this.isValid = new RegExp(this.rules, "g").test(this.value);
}

/** Contains preset regexp rules for fields */
var FieldRules = {
    notEmpty: ".+",
    notEmptyNorSpace: "^[^ \n]+.*$",
    number: "^\-?\d+\.?\d+$",
    positiveNumber: "^\d+\.?\d+$",
    negativeNumber: "^\-\d+\.?\d+$",
    positiveInteger: "^\d+$",
    negativeInteger: "^\-\d+$",
    emailAddress: "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])",
}

/** Model class for forms. This either accepts a form element which automatically
 * registers the fields through descendants that contains the [name] attribute, or 
 * manually set the input fields 
 */
function Form() {

    /** This is set to an abstract form element */
    this._element = document.createElement("form");
    
    /** key-value (fieldName-FormField obj) reprentation of the [FormField] objects
     * corresponding to the fieldNames
    */
    this._fieldObjects = {};
    
    
    /** This temporary stores pre-saved rules in case the dev sets the
     * rule first before the corresponding field
     */
    this._rules = {
        general: FieldRules.notEmptyNorSpace
    };

    this.onChange = (isValid, fields) => {}; 

    /** An internal method for initialising and registering a field element */
    this._registerElement = (fieldElement, fieldName) => {
        
        if(!fieldName) fieldName = fieldElement.getAttribute("name");
            
        /** A new FormField object (fieldObj) is created to represent the field element
         *  with its value, rules, and validity boolean. When the onChange listener is called,
         *  it passes the _fieldObjects object which contains the key-value (fieldName-fieldObj)
         *  representation for every fields.
         */
        this._fieldObjects[fieldName] = 
            new FormField(fieldElement, 

                /** The rules fed to the fieldObj can either be a pre-saved rule,
                 * the general field rule, or the FieldRules.notEmptyNorSpace (which
                 * validates fields to not accept empty fields nor shallow spaces)
                 */
                this._rules[fieldName] ||
                this._rules["general"] ||
                FieldRules.notEmptyNorSpace);


        /** This applies event listeners to the input field for when it changes value */
        FormUtils.registerChangeListeners(fieldElement, (value) => {

            /** Corresponding fieldObject */
            let fieldObj = this._fieldObjects[fieldName];
            
            /** fieldObject value is updated accordingly */
            fieldObj.value = value;

            /** fieldObject isValid property is also updated accordingly */
            this._fieldObjects[fieldName].isValid = new RegExp(fieldObj.rules, "g").test(value);

            /** This checks if neither of the fields is invalid (meaning generally valid).
             * If found any invalid fields, the isGenerallyValid is automatically false.
             */
            let isGenerallyValid = true;
            Object.values(this._fieldObjects).forEach(fieldObj=>{
                if(!fieldObj.isValid) isGenerallyValid = false;
            });


            /** Calls the onChange listener accordingly */
            this.onChange(
                isGenerallyValid,
                this._fieldObjects);
        });
    };

    /** This accepts a form element (or any child-bearing element where the fields are found) */
    this.setElement = (formElement) => {

        /** Throws when formElement is undefined or does not have children */
        if(!formElement || formElement.children==undefined) throw("The form element must be a valid HTML element");

        this._element = formElement;
        this._fieldObjects = {};

        let namedElements = this._element.querySelectorAll("[name]");
        namedElements.forEach(el => {
            this._registerElement(el);
        });
    };

    /** Manually sets the regex rules (in string) for every fields
     * 
     * This accepts an object for the key-value (fieldName-ruleString) representation
     * of the regex rules for every fields
     * */
    this.setRules = (rulesPerFieldName) => {

        /* Every fields to appear have their corresponding 
        *  fieldObject's rules representation updated as well. 
        */
        Object.keys(rulesPerFieldName).forEach(fieldName=>{


            /** The rule for the field is presaved for later use */
            this._rules[fieldName] = rulesPerFieldName[fieldName];

            if(this._fieldObjects[fieldName])
                this._fieldObjects[fieldName].rules = rulesPerFieldName[fieldName];
        });
    }

    /** Manually sets the field elements together with their fieldNames */
    this.setFields = (fieldElementsPerFieldName) => {
        Object.keys(fieldElementsPerFieldName).forEach(fieldName=>{
            this._registerElement(fieldElementsPerFieldName[fieldName], fieldName);
        });
    }

}









var Validator = {};
