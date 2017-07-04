import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    attrs: {
        country: { embedded: 'always' },
        customContent: { embedded: 'always' },
        nationalities: { embedded: 'always' },
    }
});
