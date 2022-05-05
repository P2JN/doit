class FilterSet:

    def __init__(self, my_filter_fields, my_custom_filter_fields, query_params, queryset):
        self.my_filter_fields = my_filter_fields
        self.my_custom_filter_fields = my_custom_filter_fields
        self.query_params = query_params
        self.queryset = queryset

    def get_kwargs_for_filtering(self):
        filtering_kwargs = {}
        for field in self.my_filter_fields:  # iterate over the filter fields
            # get the value of a field from request query parameter
            field_value = self.query_params.get(field)
            if field_value:
                filtering_kwargs[field] = field_value
        return filtering_kwargs

    def get_custom_kwargs_for_filtering(self):
        filtering_kwargs = {'id__in': []}
        for (field, callback) in self.my_custom_filter_fields:
            field_value = self.query_params.get(field)
            if field_value:
                filtering_kwargs['id__in'] = filtering_kwargs['id__in'] + \
                    callback(field_value)
        if len(filtering_kwargs['id__in']) == 0:
            filtering_kwargs = {}
        return filtering_kwargs

    def filter(self):
        kwargs = self.get_kwargs_for_filtering()
        custom_kwargs = self.get_custom_kwargs_for_filtering()
        queryset = self.queryset.filter(**kwargs).filter(**custom_kwargs)
        return queryset
