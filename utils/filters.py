class FilterSet:

    def __init__(self, my_filter_fields, my_custom_filter_fields, query_params, queryset, search_text=False):
        self.my_filter_fields = my_filter_fields
        self.my_custom_filter_fields = my_custom_filter_fields
        self.query_params = query_params
        self.queryset = queryset
        self.search_text = search_text

    def get_kwargs_for_filtering(self):
        filtering_kwargs = {}
        for field in self.my_filter_fields:  # iterate over the filter fields
            # get the value of a field from request query parameter
            field_value = self.query_params.get(field)
            if field_value:
                filtering_kwargs[field] = field_value
        return filtering_kwargs

    def get_custom_kwargs_for_filtering(self):
        has_filtered = False
        filtering_kwargs = {'id__in': []}

        for (field, callback) in self.my_custom_filter_fields:
            field_value = self.query_params.get(field)
            if field_value:
                has_filtered = True
                filtering_kwargs['id__in'] = filtering_kwargs['id__in'] + \
                    callback(field_value)

        if not has_filtered:
            return {}
        else:
            return filtering_kwargs

    def filter(self):
        kwargs = self.get_kwargs_for_filtering()
        custom_kwargs = self.get_custom_kwargs_for_filtering()
        queryset = self.queryset.filter(**kwargs).filter(**custom_kwargs)
        if self.search_text and self.query_params.get("search_text"):
            queryset = queryset.search_text(self.query_params.get("search_text"))
        if self.query_params.get("order_by"):
            queryset = queryset.order_by(self.query_params.get("order_by"))
        return queryset
