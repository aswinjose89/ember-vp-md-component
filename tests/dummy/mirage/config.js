import Ember from 'ember';

export default function () {

    this.passthrough('/module.json');

    this.namespace = 'api';

    //Enable/Disable Mirage logging
    this.logging = false;

    this.get('/icons');

    this.timing = 500;

    var getPagedData = function (items, page, pageSize) {
        page = Ember.isPresent(page) ? page : 1;
        pageSize = Ember.isPresent(pageSize) ? pageSize : 10;
        if (Ember.isEmpty(items.models)) {
            return items;
        }
        let endRecord = page * pageSize,
            startingRecord = endRecord - pageSize;
        Ember.Logger.log('startingRecord', startingRecord, 'endRecord', endRecord);
        items.models = items.models.filter((item, index) => (index >= startingRecord && index < endRecord));
        return items;
    };

    this.get('/users', function (schema, request) {
        var queryParams = request.queryParams;
        if (Ember.keys(queryParams).length > 0) {
            var users = schema.users.all(),
                searchTerm = queryParams.searchValue,
                totalRecords = users.models.length;
            var filterUsers = function (searchTerm) {
                searchTerm = searchTerm.toLowerCase();
                return users.models.filter(function (user) {
                    let value = user.userCountry;
                    if (typeof value === "string") {
                        if (value.toLowerCase().indexOf(searchTerm) > -1) {
                            return true;
                        }
                    }
                });
            };
            if (searchTerm) {
                users.models = filterUsers(searchTerm);
                return users;
            } else {
                let filters = (queryParams.filters) ? JSON.parse(queryParams.filters) : null,
                    pagededData = getPagedData(users, filters.pagination.page, filters.pagination.size);
                pagededData = this.serialize(pagededData);
                pagededData.meta = {
                    totalRecords: totalRecords
                };
                return pagededData;
            }
        } else {
            return schema.users.all();
        }
    });

    this.get('/countries', (schema, request) => {
        var queryParams = request.queryParams;
        if (Ember.keys(queryParams).length > 0) {
            let countries = schema.countries.all(),
                filters = (queryParams.filters) ? JSON.parse(queryParams.filters) : null;
            if (Ember.isPresent(filters)) {
                return getPagedData(countries, filters.page, filters.size);
            } else if (queryParams.searchValue) {
                let searchTerm = queryParams.searchValue.toLowerCase();
                countries.models = countries.models.filter(country => country.name.toLowerCase().indexOf(searchTerm) > -1);
                return countries;
            }
        } else {
            return schema.countries.all();
        }
    });
}