export default function copyToClipBoard(text) {
    var copyElement = document.createElement('input');
    copyElement.setAttribute('type', 'text');
    copyElement.setAttribute('value', text);
    copyElement = document.body.appendChild(copyElement);
    copyElement.select();
    try {
        if (!document.execCommand('copy')) throw 'Not allowed.';
    } catch (e) {
        copyElement.remove();
    } finally {
        if (typeof e === 'undefined') {
            copyElement.remove();
        }
    }
}
