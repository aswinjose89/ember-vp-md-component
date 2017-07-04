import Ember from 'ember';

export function escapeCode(params/*, hash*/) {
    var escape = document.createElement('textarea');
    escape.textContent = params[0];
    return Ember.String.htmlSafe(escape.innerHTML);
}

export default Ember.Helper.helper(escapeCode);
