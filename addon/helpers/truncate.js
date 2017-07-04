import Ember from 'ember';

export function truncate(params, hash) {
    var newLines, limit = hash.limit || 50,
        value = params[0],
        visibleLines = hash.visibleLines,
        dots = (Ember.isEmpty(hash.dots) ? true : false);
    if (!Ember.isEmpty(value) && (value.length > limit)) {
        if (!dots) {
            value = value.substr(0, limit);
        } else {
            value = value.substr(0, limit - 3);
            value = value + "...";
        }
    }
    //check for new lines and truncate if greater than the visibleLines. Use output of new-line-to-bar helper
    try {
        newLines = value.match(/<br\/>/g);
    } catch (error) {
        Ember.Logger.error('truncate helper: value is undefined', error);
    }
    if (Ember.isPresent(newLines) && Ember.isPresent(value) && newLines.length >= visibleLines) {
        value = value.substr(0, value.split('<br/>', visibleLines).join('<br/>').length);
    }
    return value;
}

export default Ember.Helper.helper(truncate);