var EDD_API;
(function ($) {

    function empty_func() {
    }

    function extend() {
        if (typeof $.extend === 'function') {
            return $.extend.call(arguments);
        }

        for (var i = 1; i < arguments.length; i++)
            for (var key in arguments[i])
                if (arguments[i].hasOwnProperty(key))
                    arguments[0][key] = arguments[i][key];
        return arguments[0];
    }

    function serialize(obj, prefix) {
        var str = [], p;
        for (p in obj) {
            if (obj.hasOwnProperty(p)) {
                var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
                str.push((v !== null && typeof v === "object") ?
                    serialize(v, k) :
                encodeURIComponent(k) + "=" + encodeURIComponent(v));
            }
        }
        return str.join("&");
    }

    function ajax_get(url, data, success_callback, error_callback) {
        data = data || {};
        success_callback = success_callback || function (response) {
            };
        error_callback = error_callback || function (response) {
            };

        if (typeof $.ajax === 'function') {
            return $.ajax(url, {data: data}).then(
                function success(response) {
                    success_callback(response)
                },
                function fail(response, status) {
                    error_callback(response, status);
                });
        } else {
            var xhr = new XMLHttpRequest();

            url = url + '?' + serialize(data);

            xhr.open('GET', url);
            xhr.onload = function () {
                var response = JSON.parse(xhr.responseText);
                if (xhr.status === 200) {
                    success_callback(response);
                }
                else {
                    error_callback(response, xhr.responseStatus);
                }
            };
            xhr.send();
        }
    }

    function valid_callback(callback) {
        return typeof callback === 'function' ? callback : empty_func;
    }

    EDD_API = function (api) {
        var _api = extend({
            url: '',
            key: '',
            token: ''
        }, api || {});

        function call_api(endpoint, args, success, error) {
            var url = _api.url + endpoint;

            args = extend({
                key: _api.key,
                token: _api.token
            }, args);

            ajax_get(url, args, success, error);
        }

        this.get_customer = function (customer, args, success_callback, error_callback) {
            args = extend({
                customer: customer
            }, args);

            success_callback = valid_callback(success_callback);
            error_callback = valid_callback(error_callback);

            call_api('customers', args, function (data) {
                var customer = data.customers !== undefined && data.customers[0] !== undefined ? data.customers[0] : null;
                success_callback(customer);
            }, function (error) {
                error_callback(error)
            });
        };

        this.get_customers = function (args, success_callback, error_callback) {
            args = extend({
                //  The date to retrieve earnings or sales for. This has three accepted values: today, yesterday & range.
                date: null,
                // Format: YYYYMMDD. Example: 20120224 = 2012/02/24
                startdate: null,
                // Format: YYYYMMDD. Example: 20120531 = 2012/02/24
                enddate: null
            }, args);

            success_callback = valid_callback(success_callback);
            error_callback = valid_callback(error_callback);

            if (args.startdate || args.enddate) {
                args.date = 'range';
            } else if (['today', 'yesterday', 'range'].indexOf(args.date) !== -1) {
                args.date = null;
            }

            call_api('customers', args, function (data) {
                var customers = data.customers !== undefined && data.customers.length ? data.customers : [];
                success_callback(customers);
            }, function (error) {
                error_callback(error)
            });
        };

        this.get_product = function (product, args, success_callback, error_callback) {
            args = extend({
                product: product
            }, args);

            success_callback = valid_callback(success_callback);
            error_callback = valid_callback(error_callback);

            call_api('products', args, function (data) {
                var product = data.products !== undefined && data.products[0] !== undefined ? data.products[0] : null;
                success_callback(product);
            }, function (error) {
                error_callback(error)
            });
        };

        this.get_products = function (args, success_callback, error_callback) {
            args = extend({
                s: null, // Accepts search string.
                category: null, // Accepts name or id.
                tag: null // Accepts name or id.
            }, args);

            success_callback = valid_callback(success_callback);
            error_callback = valid_callback(error_callback);

            if (args.startdate || args.enddate) {
                args.date = 'range';
            } else if (['today', 'yesterday', 'range'].indexOf(args.date) !== -1) {
                args.date = null;
            }

            call_api('products', args, function (data) {
                var products = data.products !== undefined && data.products.length ? data.products : [];
                success_callback(products);
            }, function (error) {
                error_callback(error)
            });
        };

        this.get_sales_by_ = function (type, value, args, success_callback, error_callback) {
            args = extend({
                number: null,
                email: null,
                id: null,
                purchasekey: null
            }, args);

            success_callback = valid_callback(success_callback);
            error_callback = valid_callback(error_callback);

            switch (type) {
            case 'id':
                args.id = value;
                break;
            case 'purchasekey':
                args.purchasekey = value;
                break;
            case 'email':
            default:
                args.email = value;
                break;
            }

            call_api('sales', args, function (data) {
                var sales = data.sales !== undefined && data.sales.length ? data.sales : [];
                success_callback(sales);
            }, function (error) {
                error_callback(error)
            });
        };

        this.get_discounts = function (args, success_callback, error_callback) {
            args = extend({}, args);

            call_api('discounts', args, function (data) {
                var discounts = data.discounts !== undefined && data.discounts.length ? data.discounts : [];
                success_callback(discounts);
            }, function (error) {
                error_callback(error)
            });
        }

        this.get_download_logs = function (args, success_callback, error_callback) {
            args = extend({
                customer: null
            }, args);

            call_api('download-logs', args, function (data) {
                var download_logs = data.download_logs !== undefined && data.download_logs.length ? data.download_logs : [];
                success_callback(download_logs);
            }, function (error) {
                error_callback(error)
            });
        }

        this.get_stats = function (type, args, success_callback, error_callback) {
            args = extend({
                // Accepts sales or earnings.
                type: type,
                //  The date to retrieve earnings or sales for. This has three accepted values: today, yesterday & range.
                date: null,
                // Format: YYYYMMDD. Example: 20120224 = 2012/02/24
                startdate: null,
                // Format: YYYYMMDD. Example: 20120531 = 2012/02/24
                enddate: null,
                // Used to retrieve sale or earnings stats for a specific product, or all products. This option has two accepted values: all or a product # id.
                product: null
            }, args);

            if (args.startdate || args.enddate) {
                args.date = 'range';
            } else if (['today', 'yesterday', 'range'].indexOf(args.date) !== -1) {
                args.date = null;
            }

            call_api('stats', args, function (data) {
                var stats = args.date === 'range' ? data : ( data[args.type] !== undefined ? data[args.type] : null );
                success_callback(stats);
            }, function (error) {
                error_callback(error)
            });
        }

        return this;
    };


}(window.jQuery || {}));