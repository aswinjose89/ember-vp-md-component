import Ember from 'ember';

export function newLineToBr(params) {
    let content = params[0];
    if (Ember.isPresent(content)) {
        content = content.replace(/\r(?!\n)|\n(?!\r)/g, '<br/>');
    }
    return content;
}

export default Ember.Helper.helper(newLineToBr);